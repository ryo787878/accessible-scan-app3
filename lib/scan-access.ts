import { db } from "@/lib/db";
import { isValidPublicId } from "@/lib/public-id";

export type ScanAccess = "invalid" | "not_found" | "forbidden" | "allowed";

export async function resolveScanAccess(publicId: string, viewerUserId: string | null): Promise<ScanAccess> {
  if (!isValidPublicId(publicId)) {
    return "invalid";
  }

  const scanModel = db.scan as {
    findUnique?: (args: { where: { publicId: string }; select: { userId: true } }) => Promise<{ userId: string | null } | null>;
    findFirst?: (args: { where: { publicId: string }; select: { userId: true } }) => Promise<{ userId: string | null } | null>;
  };

  const query = {
    where: { publicId },
    select: { userId: true as const },
  };

  const scan = scanModel.findUnique
    ? await scanModel.findUnique(query)
    : scanModel.findFirst
      ? await scanModel.findFirst(query)
      : null;

  if (!scan) {
    return "not_found";
  }

  if (scan.userId && scan.userId !== viewerUserId) {
    return "forbidden";
  }

  return "allowed";
}
