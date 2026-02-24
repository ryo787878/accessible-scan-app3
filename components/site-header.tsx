"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();

  const isHome = pathname === "/";

  return (
    <header className="bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="bg-primary flex size-7 items-center justify-center rounded-md">
            <Shield className="text-primary-foreground size-4" aria-hidden="true" />
          </div>
          <span className="text-sm font-bold tracking-tight">
            Accessible Scan
          </span>
        </Link>

        {!isHome && (
          <nav aria-label="メインナビゲーション">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              新しい診断を開始
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
