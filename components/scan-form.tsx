"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ScanForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [maxPages, setMaxPages] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [agreementError, setAgreementError] = useState<string | null>(null);
  const [hasAuthorization, setHasAuthorization] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUrlError(null);
    setAgreementError(null);

    // クライアントサイドバリデーション
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setUrlError("URLを入力してください");
      return;
    }

    if (
      !trimmedUrl.startsWith("http://") &&
      !trimmedUrl.startsWith("https://")
    ) {
      setUrlError("http:// または https:// で始まるURLを入力してください");
      return;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      setUrlError("有効なURLを入力してください");
      return;
    }

    if (!hasAuthorization || !acceptedTerms) {
      setAgreementError("権限確認と規約同意の両方が必要です");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmedUrl, maxPages, hasAuthorization, acceptedTerms }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 429) {
          toast.error("レート制限", {
            description: data.error,
          });
        } else {
          toast.error("エラー", {
            description: data.error ?? "診断の開始に失敗しました",
          });
        }
        return;
      }

      const data = await res.json();
      toast.success("診断を開始しました", {
        description: "診断の進捗をリアルタイムで確認できます",
      });
      router.push(`/scan/${data.publicId}`);
    } catch {
      toast.error("通信エラー", {
        description: "サーバーとの通信に失敗しました。しばらく経ってから再試行してください。",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-xl">診断設定</CardTitle>
        <CardDescription>
          診断したいWebサイトのURLとページ数を指定してください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="scan-url">URL</Label>
            <div className="relative">
              <Search
                className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
                aria-hidden="true"
              />
              <Input
                id="scan-url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (urlError) setUrlError(null);
                }}
                aria-invalid={!!urlError}
                aria-describedby={urlError ? "url-error" : undefined}
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
            {urlError && (
              <p id="url-error" className="text-destructive text-sm" role="alert">
                {urlError}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="max-pages">診断ページ数</Label>
              <span className="text-muted-foreground text-sm font-mono">
                {maxPages} ページ
              </span>
            </div>
            <Slider
              id="max-pages"
              min={1}
              max={20}
              step={1}
              value={[maxPages]}
              onValueChange={([val]) => setMaxPages(val)}
              disabled={isSubmitting}
              aria-label={`診断ページ数: ${maxPages}ページ`}
            />
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>1</span>
              <span>20</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox
                id="has-authorization"
                checked={hasAuthorization}
                onCheckedChange={(checked) => {
                  setHasAuthorization(checked === true);
                  if (agreementError) setAgreementError(null);
                }}
                disabled={isSubmitting}
                aria-describedby="authorization-help"
              />
              <div className="space-y-1">
                <Label htmlFor="has-authorization" className="cursor-pointer leading-relaxed">
                  対象サイトの管理者、または診断権限を持つ担当者であることを確認しました
                </Label>
                <p id="authorization-help" className="text-muted-foreground text-xs">
                  第三者サイトの無断診断や、ログイン突破などの回避行為は禁止です。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="accept-terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => {
                  setAcceptedTerms(checked === true);
                  if (agreementError) setAgreementError(null);
                }}
                disabled={isSubmitting}
                aria-describedby="terms-help"
              />
              <Label htmlFor="accept-terms" id="terms-help" className="cursor-pointer leading-relaxed">
                <Link href="/terms" className="text-primary hover:underline">
                  利用規約
                </Link>
                と
                <Link href="/privacy" className="text-primary hover:underline">
                  プライバシーポリシー
                </Link>
                に同意します
              </Label>
            </div>

            {agreementError && (
              <p className="text-destructive text-sm" role="alert">
                {agreementError}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || !hasAuthorization || !acceptedTerms}
            className="w-full text-base"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                診断を開始しています...
              </>
            ) : (
              "無料診断を開始"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
