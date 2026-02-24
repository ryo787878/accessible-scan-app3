import { NextResponse } from "next/server";
import { buildScanView } from "@/lib/summary";
import { isValidPublicId } from "@/lib/public-id";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await params;
  if (!isValidPublicId(publicId)) {
    return NextResponse.json({ error: "スキャンIDの形式が不正です" }, { status: 400 });
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
