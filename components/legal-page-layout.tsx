import type { ReactNode } from "react";
import { CtaLink } from "@/components/cta-link";
import { MarkdownDocLayout } from "@/components/markdown-doc-layout";

export type LegalSection = {
  title: string;
  content: ReactNode;
};

type LegalPageLayoutProps = {
  title: string;
  updatedAt: string;
  summary: string;
  sections: LegalSection[];
};

export function LegalPageLayout({ title, updatedAt, summary, sections }: LegalPageLayoutProps) {
  return (
    <MarkdownDocLayout title={title} meta={`最終更新日: ${updatedAt}`} description={summary}>
      <div className="space-y-7">
        {sections.map((section) => (
          <section key={section.title} className="border-b pb-7 last:border-b-0 last:pb-0">
            <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
            <div className="prose prose-neutral dark:prose-invert mt-3 max-w-none">{section.content}</div>
          </section>
        ))}
      </div>
      <section aria-label="関連導線" className="mt-8 border-t pt-6">
        <div className="flex flex-wrap gap-3">
          <CtaLink href="/" priority="primary" showArrow>
            無料診断を開始する
          </CtaLink>
          <CtaLink href="/ja" priority="secondary">
            日本語ガイドへ戻る
          </CtaLink>
        </div>
      </section>
    </MarkdownDocLayout>
  );
}
