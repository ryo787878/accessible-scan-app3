"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { data: session, status } = useSession();

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

        <div className="flex items-center gap-2">
          {status === "authenticated" ? (
            <>
              <span className="text-muted-foreground hidden text-xs sm:inline">
                {session.user.email}
              </span>
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
