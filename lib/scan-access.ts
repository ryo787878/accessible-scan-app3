import { db } from "@/lib/db";
import { isValidPublicId } from "@/lib/public-id";

export type ScanAccess = "invalid" | "not_found" | "forbidden" | "allowed";

export async function resolveScanAccess(publicId: string, viewerUserId: string | null): Promise<ScanAccess> {
  if (!isValidPublicId(publicId)) {
    return "invalid";
  }

  const scan = await db.scan.findUnique({
    where: { publicId },
    select: { userId: true },
  });

  if (!scan) {
    return "not_found";
  }

  if (scan.userId && scan.userId !== viewerUserId) {
    return "forbidden";
  }

  return "allowed";
}
