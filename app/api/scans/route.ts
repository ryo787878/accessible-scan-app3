import { NextRequest, NextResponse } from "next/server";
import net from "node:net";
import { createHash } from "node:crypto";
import { TextDecoder } from "node:util";
import { nanoid } from "nanoid";
import { auth } from "@/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateInput } from "@/lib/validation";
import { db } from "@/lib/db";
import { enqueueScanJob } from "@/lib/jobs";
import { ensureDbSchema } from "@/lib/db-init";
import { recoverStaleScans } from "@/lib/scan-recovery";

const MAX_REQUEST_BYTES = 16 * 1024;
const decoder = new TextDecoder();

async function parseJsonBodyWithLimit(request: NextRequest): Promise<unknown> {
  const stream = request.body;
  if (!stream) {
    throw new Error("INVALID_JSON");
  }

  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    received += value.byteLength;
    if (received > MAX_REQUEST_BYTES) {
      throw new Error("PAYLOAD_TOO_LARGE");
    }
    chunks.push(value);
  }

  const merged = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const text = decoder.decode(merged);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("INVALID_JSON");
  }
}

function isSameOriginRequest(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const host = request.headers.get("host");
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function pickIp(value: string | null): string | null {
  if (!value) return null;
  const first = value.split(",")[0]?.trim();
  if (!first || net.isIP(first) === 0) return null;
  return first;
}

function getClientKey(request: NextRequest): string {
  const ip =
    pickIp(request.headers.get("cf-connecting-ip")) ??
    pickIp(request.headers.get("x-real-ip")) ??
    pickIp(request.headers.get("x-forwarded-for"));

  if (ip) return ip;

  const ua = request.headers.get("user-agent") ?? "unknown";
  const uaHash = createHash("sha256").update(ua).digest("hex").slice(0, 16);
  return `unknown:${uaHash}`;
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "不正なオリジンです" }, { status: 403 });
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength) {
    const size = Number.parseInt(contentLength, 10);
    if (Number.isFinite(size) && size > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: "リクエストボディが大きすぎます" }, { status: 413 });
    }
  }

  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Content-Type は application/json を指定してください" }, { status: 415 });
  }

  const ip = getClientKey(request);

  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `レート制限を超えています。${rate.retryAfterSeconds}秒後に再試行してください。` },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      }
    );
  }

  let body: unknown;
  try {
    body = await parseJsonBodyWithLimit(request);
  } catch (error) {
    if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") {
      return NextResponse.json({ error: "リクエストボディが大きすぎます" }, { status: 413 });
    }
    return NextResponse.json({ error: "リクエストボディが不正です" }, { status: 400 });
  }

  try {
    await ensureDbSchema();
    await recoverStaleScans();
    const validated = await validateInput(body);

    const scan = await db.scan.create({
      data: {
        publicId: `scan_${nanoid(10)}`,
        inputUrl: validated.inputUrl,
        normalizedRootUrl: validated.normalizedRootUrl,
        maxPages: validated.maxPages,
        userId: userId ?? null,
        status: "queued",
      },
    });

    const enqueue = enqueueScanJob(scan.publicId);
    if (!enqueue.accepted) {
      await db.scan.update({
        where: { id: scan.id },
        data: {
          status: "failed",
          errorMessage: "現在アクセスが集中しています。しばらくしてから再試行してください。",
          finishedAt: new Date(),
        },
      });
      return NextResponse.json({ error: "現在アクセスが集中しています。しばらくしてから再試行してください。" }, { status: 503 });
    }

    return NextResponse.json(
      {
        publicId: scan.publicId,
        status: scan.status,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid URL";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
