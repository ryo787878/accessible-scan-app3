import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { buildScanReport } from "@/lib/summary";
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
    return NextResponse.json({ error: "レポートが見つかりません" }, { status: 404 });
  }

  const report = await buildScanReport(publicId);
  if (!report) {
    return NextResponse.json({ error: "レポートが見つかりません" }, { status: 404 });
  }

  return NextResponse.json(report);
}
