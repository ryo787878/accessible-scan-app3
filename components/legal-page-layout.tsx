import type { ReactNode } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <PageShell maxWidth="3xl">
      <div className="space-y-4">
        <Card className="bg-card/95">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">{title}</CardTitle>
            <p className="text-muted-foreground text-sm">最終更新日: {updatedAt}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{summary}</p>
          </CardHeader>
        </Card>
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold tracking-tight">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral dark:prose-invert max-w-none">{section.content}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
