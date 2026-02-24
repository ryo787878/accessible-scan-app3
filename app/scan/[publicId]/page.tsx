import type { Metadata } from "next";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { PageShell } from "@/components/page-shell";
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
    <PageShell maxWidth="3xl">
      <div className="flex flex-col gap-6">
        <PageBreadcrumbs items={[{ label: "トップ", href: "/" }, { label: "診断進捗" }]} />
        <ScanProgress publicId={publicId} />
      </div>
    </PageShell>
  );
}
