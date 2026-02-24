import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="text-muted-foreground mx-auto flex max-w-4xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs md:flex-row">
        <p>© {year} Accessible Scan</p>
        <div className="flex items-center gap-3">
          <Link href="/" className="hover:text-foreground transition-colors">
            トップ
          </Link>
          <span aria-hidden="true">|</span>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            利用規約
          </Link>
          <span aria-hidden="true">|</span>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            プライバシー
          </Link>
          <span aria-hidden="true">|</span>
          <span>自動診断のみ</span>
        </div>
      </div>
    </footer>
  );
}
