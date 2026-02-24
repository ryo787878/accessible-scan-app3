import type { ReactNode } from "react";
import { PageShell } from "@/components/page-shell";

type MarkdownDocLayoutProps = {
  title: string;
  description?: string;
  meta?: string;
  children: ReactNode;
};

export function MarkdownDocLayout({ title, description, meta, children }: MarkdownDocLayoutProps) {
  return (
    <PageShell maxWidth="3xl">
      <article className="mx-auto w-full max-w-none">
        <header className="mb-8 border-b pb-5">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {meta ? <p className="text-muted-foreground mt-2 text-sm">{meta}</p> : null}
          {description ? <p className="text-muted-foreground mt-3 leading-relaxed">{description}</p> : null}
        </header>
        {children}
      </article>
    </PageShell>
  );
}
