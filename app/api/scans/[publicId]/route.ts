import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { buildScanView } from "@/lib/summary";
import { resolveScanAccess } from "@/lib/scan-access";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await params;
  const session = await auth();
  const access = await resolveScanAccess(publicId, session?.user?.id ?? null);

  if (access === "invalid") {
    return NextResponse.json({ error: "スキャンIDの形式が不正です" }, { status: 400 });
  }

  if (access !== "allowed") {
    return NextResponse.json({ error: "スキャンが見つかりません" }, { status: 404 });
  }

  const scan = await buildScanView(publicId);
  if (!scan) {
    return NextResponse.json({ error: "スキャンが見つかりません" }, { status: 404 });
  }

  return NextResponse.json({
    publicId: scan.publicId,
    status: scan.status,
    inputUrl: scan.url,
    url: scan.url,
    maxPages: scan.maxPages,
    createdAt: scan.createdAt,
    progress: scan.progress,
    pages: scan.pages,
    errorMessage: scan.errorMessage,
  });
}
