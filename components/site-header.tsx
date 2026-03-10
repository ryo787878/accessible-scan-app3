"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { isPaidSubscription } from "@/lib/subscription";

export function SiteHeader() {
  const { data: session, status } = useSession();
  const isPaid = isPaidSubscription(session?.user?.subscriptionStatus);
  const planLabel = isPaid ? "有料プラン" : "無料プラン";

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

        <nav aria-label="主要ページ" className="hidden items-center gap-4 md:flex">
          <Link href="/ja" className="text-sm hover:underline">
            日本語ガイド
          </Link>
          <Link href="/ja/accessibility-diagnosis" className="text-sm hover:underline">
            診断ガイド
          </Link>
          <Link href="/ja/compare/accessibility-tools" className="text-sm hover:underline">
            ツール比較
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {status === "authenticated" ? (
            <>
              <Badge variant={isPaid ? "default" : "secondary"}>{planLabel}</Badge>
              <span className="text-muted-foreground hidden text-xs sm:inline">
                {session.user.email}
              </span>
              <Button asChild type="button" variant="outline" size="sm">
                <Link href="/billing">請求管理</Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                ログアウト
              </Button>
            </>
          ) : (
            <Button asChild type="button" size="sm">
              <Link href="/login">ログイン</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
