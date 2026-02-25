"use client";

import { LogIn, UserPlus } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginPanel({ callbackUrl }: { callbackUrl: string }) {
  const { status } = useSession();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <LogIn className="size-4" aria-hidden="true" />
            ログイン
          </CardTitle>
          <CardDescription>
            すでに会員の方は、Googleアカウントでログインしてください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            disabled={status === "loading"}
            onClick={() => signIn("google", { callbackUrl })}
          >
            Googleでログイン
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="size-4" aria-hidden="true" />
            会員登録
          </CardTitle>
          <CardDescription>
            初めての方は、Googleアカウントで会員登録できます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full"
            disabled={status === "loading"}
            onClick={() => signIn("google", { callbackUrl }, { prompt: "consent" })}
          >
            Googleで会員登録
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
