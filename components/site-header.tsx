"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Shield } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { isPaidSubscription } from "@/lib/subscription";

export function SiteHeader() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isPaid = isPaidSubscription(session?.user?.subscriptionStatus);
  const planLabel = isPaid ? "有料プラン" : "無料プラン";
  const isJaActive = pathname === "/ja" || pathname.startsWith("/ja/");
  const isDiagnosisActive = pathname === "/ja/accessibility-diagnosis";
  const isCompareActive = pathname.startsWith("/ja/compare");

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
          <Link
            href="/ja"
            className={`text-sm ${isJaActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground hover:underline"}`}
            aria-current={isJaActive ? "page" : undefined}
          >
            日本語ガイド
          </Link>
          <Link
            href="/ja/accessibility-diagnosis"
            className={`text-sm ${isDiagnosisActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground hover:underline"}`}
            aria-current={isDiagnosisActive ? "page" : undefined}
          >
            診断ガイド
          </Link>
          <Link
            href="/ja/compare/accessibility-tools"
            className={`text-sm ${isCompareActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground hover:underline"}`}
            aria-current={isCompareActive ? "page" : undefined}
          >
            ツール比較
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="メニューを開く"
              >
                <Menu className="size-4" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-xs">
              <SheetHeader>
                <SheetTitle>メニュー</SheetTitle>
                <SheetDescription>主要ページへ移動できます。</SheetDescription>
              </SheetHeader>
              <nav aria-label="モバイル主要ページ" className="flex flex-col gap-2 px-4">
                <SheetClose asChild>
                  <Link
                    href="/ja"
                    className={`rounded-md border px-3 py-2 text-sm ${isJaActive ? "bg-muted font-medium" : "hover:bg-muted"}`}
                    aria-current={isJaActive ? "page" : undefined}
                  >
                    日本語ガイド
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/ja/accessibility-diagnosis"
                    className={`rounded-md border px-3 py-2 text-sm ${isDiagnosisActive ? "bg-muted font-medium" : "hover:bg-muted"}`}
                    aria-current={isDiagnosisActive ? "page" : undefined}
                  >
                    診断ガイド
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/ja/compare/accessibility-tools"
                    className={`rounded-md border px-3 py-2 text-sm ${isCompareActive ? "bg-muted font-medium" : "hover:bg-muted"}`}
                    aria-current={isCompareActive ? "page" : undefined}
                  >
                    ツール比較
                  </Link>
                </SheetClose>
              </nav>
              <div className="mt-4 flex flex-col gap-2 border-t px-4 pt-4">
                {status === "authenticated" ? (
                  <>
                    <Badge variant={isPaid ? "default" : "secondary"} className="w-fit">
                      {planLabel}
                    </Badge>
                    <p className="text-muted-foreground truncate text-xs">{session.user.email}</p>
                    <SheetClose asChild>
                      <Button asChild type="button" variant="outline" size="sm">
                        <Link href="/billing">請求管理</Link>
                      </Button>
                    </SheetClose>
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
                  <SheetClose asChild>
                    <Button asChild type="button" size="sm">
                      <Link href="/login">ログイン</Link>
                    </Button>
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <div className="hidden items-center gap-2 md:flex">
            {status === "authenticated" ? (
              <>
                <Badge variant={isPaid ? "default" : "secondary"}>{planLabel}</Badge>
                <span className="text-muted-foreground hidden text-xs lg:inline">
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
      </div>
    </header>
  );
}
