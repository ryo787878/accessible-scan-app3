import { NextResponse } from "next/server";
import { buildScanView } from "@/lib/summary";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await params;
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
