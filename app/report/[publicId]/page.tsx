import type { Metadata } from "next";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { PageShell } from "@/components/page-shell";
import { ReportView } from "@/components/report/report-view";
import { ogImageUrl } from "@/lib/seo/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ publicId: string }>;
}): Promise<Metadata> {
  const { publicId } = await params;
  const canonicalPath = `/report/${publicId}`;
  const title = `診断レポート ${publicId}`;
  const description = "アクセシビリティ診断の詳細レポートページです。";

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
          url: ogImageUrl("lp", "診断レポート"),
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
      images: [ogImageUrl("lp", "診断レポート")],
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = await params;

  return (
    <PageShell maxWidth="4xl">
      <div className="flex flex-col gap-6">
        <PageBreadcrumbs
          items={[
            { label: "トップ", href: "/" },
            { label: "診断進捗", href: `/scan/${publicId}` },
            { label: "レポート" },
          ]}
        />
        <ReportView publicId={publicId} />
      </div>
    </PageShell>
  );
}
