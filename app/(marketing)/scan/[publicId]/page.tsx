import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { ScanProgress } from "@/components/scan-progress";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { resolveScanAccess } from "@/lib/scan-access";
import { createBreadcrumbData } from "@/lib/seo/breadcrumbs";
import { shouldNoIndexPath } from "@/lib/seo/indexing";
import { buildPageMetadata } from "@/lib/seo/metadata";

const resolveAccess = cache(async (publicId: string) => {
  const session = await auth();
  return resolveScanAccess(publicId, session?.user?.id ?? null);
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ publicId: string }>;
}): Promise<Metadata> {
  const { publicId } = await params;
  const canonicalPath = `/scan/${publicId}`;
  const access = await resolveAccess(publicId);

  return buildPageMetadata({
    title: access === "allowed" ? "診断進捗" : "ページが見つかりません",
    path: canonicalPath,
    description: "アクセシビリティ診断ジョブの進捗ページです。",
    ogType: "lp",
    ogTitle: "診断進捗",
    noIndex: access !== "allowed" || shouldNoIndexPath(canonicalPath),
  });
}

export default async function ScanPage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = await params;
  const access = await resolveAccess(publicId);

  if (access !== "allowed") {
    notFound();
  }

  const breadcrumb = createBreadcrumbData([
    { label: "トップ", path: "/" },
    { label: "診断進捗", path: `/scan/${publicId}` },
  ]);

  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center px-4 py-12 md:py-5">
      <BreadcrumbJsonLd items={breadcrumb.jsonLdItems} />
      <div className="flex w-full max-w-3xl flex-col gap-6">
        <PageBreadcrumbs items={breadcrumb.pageItems} />
        <ScanProgress publicId={publicId} />
      </div>
    </main>
  );
}
