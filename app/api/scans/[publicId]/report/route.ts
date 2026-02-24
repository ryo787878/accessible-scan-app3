import { NextResponse } from "next/server";
import { buildScanReport } from "@/lib/summary";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await params;
  const report = await buildScanReport(publicId);

  if (!report) {
    return NextResponse.json({ error: "レポートが見つかりません" }, { status: 404 });
  }

  return NextResponse.json(report);
}
