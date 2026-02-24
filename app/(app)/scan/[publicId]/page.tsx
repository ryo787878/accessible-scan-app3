import type { Metadata } from "next";
import Link from "next/link";
import { ScanProgress } from "@/components/scan-progress";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { shouldNoIndexPath } from "@/lib/seo/indexing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ publicId: string }>;
}): Promise<Metadata> {
  const { publicId } = await params;
  const canonicalPath = `/scan/${publicId}`;

  return buildPageMetadata({
    title: `診断進捗 ${publicId}`,
    path: canonicalPath,
    description: "アクセシビリティ診断ジョブの進捗ページです。",
    ogType: "lp",
    ogTitle: "診断進捗",
    noIndex: shouldNoIndexPath(canonicalPath),
  });
}

export default async function ScanPage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = await params;

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-12 md:py-5">
      <div className="flex w-full max-w-3xl flex-col gap-6">
        <nav aria-label="パンくずリスト">
          <ol className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                トップ
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground font-medium">診断進捗</li>
          </ol>
        </nav>
        <ScanProgress publicId={publicId} />
      </div>
    </main>
  );
}
