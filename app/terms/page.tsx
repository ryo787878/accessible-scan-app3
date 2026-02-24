import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約",
  description: "Accessible Scan の利用規約",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <article className="prose prose-neutral max-w-none">
        <h1>利用規約</h1>
        <p>最終更新日: 2026-02-24</p>

        <h2>1. 対象サイトの権限要件</h2>
        <p>本サービスは、利用者が管理権限または明示的な診断権限を持つWebサイトのみを対象とします。</p>

        <h2>2. robots.txt / サイト規約の尊重</h2>
        <p>
          本サービスは robots.txt の Disallow を尊重して診断対象を制御します。利用者は対象サイトの利用規約・運用ポリシーを確認し、これを遵守するものとします。
        </p>

        <h2>3. 自動診断の限界</h2>
        <p>
          診断結果は自動検出に基づく参考情報です。WCAG適合性の完全判定を保証するものではなく、最終判断には手動監査を推奨します。
        </p>

        <h2>4. 負荷制御のための制限</h2>
        <p>
          サービス保護のため、リクエスト回数・同時実行数・診断ページ数等に技術的制限を設けます。制限値は予告なく変更される場合があります。
        </p>

        <h2>5. 禁止行為</h2>
        <ul>
          <li>第三者サイトの無断診断</li>
          <li>ログイン突破、認証回避、アクセス制御回避</li>
          <li>robots.txt や利用規約に反するアクセス</li>
          <li>サービス運用を妨げる過剰アクセス、攻撃的利用</li>
        </ul>
      </article>
    </main>
  );
}
