import { CtaLink } from "@/components/cta-link";
import { LoginPanel } from "@/components/auth/login-panel";
import { sanitizeCallbackUrl } from "@/lib/auth-redirect";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = sanitizeCallbackUrl(params.callbackUrl);

  return (
    <main id="main-content" className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-3xl flex-col justify-center px-4 py-10">
      <section className="mb-6 space-y-3">
        <h1 className="text-2xl font-bold tracking-tight">ログイン / 会員登録</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          会員登録すると、ルール別集計とページ別詳細レポートを閲覧できます。
        </p>
      </section>
      <LoginPanel callbackUrl={callbackUrl} />
      <section className="mt-6 flex flex-wrap gap-2">
        <CtaLink href="/terms" priority="tertiary" size="sm">
          利用規約
        </CtaLink>
        <CtaLink href="/privacy" priority="tertiary" size="sm">
          プライバシーポリシー
        </CtaLink>
      </section>
    </main>
  );
}
