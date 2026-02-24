import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const maxWidthClass = {
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
} as const;

type PageShellProps = {
  children: ReactNode;
  maxWidth?: keyof typeof maxWidthClass;
  className?: string;
};

export function PageShell({ children, maxWidth = "4xl", className }: PageShellProps) {
  return (
    <main className={cn("flex min-h-[calc(100vh-3.5rem)] justify-center px-4 py-10", className)}>
      <div className={cn("w-full", maxWidthClass[maxWidth])}>{children}</div>
    </main>
  );
}
