import { NextResponse } from "next/server";
import { buildScanReport } from "@/lib/summary";
import { isValidPublicId } from "@/lib/public-id";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await params;
  if (!isValidPublicId(publicId)) {
    return NextResponse.json({ error: "スキャンIDの形式が不正です" }, { status: 400 });
  }
  const report = await buildScanReport(publicId);

  if (!report) {
    return NextResponse.json({ error: "レポートが見つかりません" }, { status: 404 });
  }

  return NextResponse.json(report);
}
