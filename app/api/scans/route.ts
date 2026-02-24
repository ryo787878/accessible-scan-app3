import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateInput } from "@/lib/validation";
import { db } from "@/lib/db";
import { enqueueScanJob } from "@/lib/jobs";
import { ensureDbSchema } from "@/lib/db-init";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

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
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストボディが不正です" }, { status: 400 });
  }

  try {
    await ensureDbSchema();
    const validated = await validateInput(body);

    const scan = await db.scan.create({
      data: {
        publicId: `scan_${nanoid(10)}`,
        inputUrl: validated.inputUrl,
        normalizedRootUrl: validated.normalizedRootUrl,
        maxPages: validated.maxPages,
        status: "queued",
      },
    });

    enqueueScanJob(scan.publicId);

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
