import type { Metadata } from "next";
import Link from "next/link";
import { ScanProgress } from "@/components/scan-progress";
import { ogImageUrl } from "@/lib/seo/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ publicId: string }>;
}): Promise<Metadata> {
  const { publicId } = await params;
  const canonicalPath = `/scan/${publicId}`;
  const title = `診断進捗 ${publicId}`;
  const description = "アクセシビリティ診断ジョブの進捗ページです。";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      images: [
        {
          url: ogImageUrl("lp", "診断進捗"),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl("lp", "診断進捗")],
    },
    robots: {
      index: false,
      follow: false,
    },
  };
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
