import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "Accessible Scan のプライバシーポリシー",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <article className="prose prose-neutral max-w-none">
        <h1>プライバシーポリシー</h1>
        <p>最終更新日: 2026-02-24</p>

        <h2>1. 収集するデータ</h2>
        <ul>
          <li>入力URLおよび正規化URL</li>
          <li>診断結果（ページURL、検出ルール、重大度、エラー情報）</li>
          <li>運用ログ（障害調査・不正利用対策に必要な最小限のアクセス情報）</li>
        </ul>

        <h2>2. 利用目的</h2>
        <ul>
          <li>診断機能の提供と結果表示</li>
          <li>障害対応、品質改善、不正利用防止</li>
          <li>法令・規約に基づく対応</li>
        </ul>

        <h2>3. 保存期間</h2>
        <p>
          診断データとログは、サービス運用に必要な期間のみ保持し、不要となったデータは順次削除します。詳細な保持期間は運用方針に基づき見直す場合があります。
        </p>

        <h2>4. データ最小化</h2>
        <p>
          本サービスは、診断に不要な個人情報を意図的に収集しません。保存項目は機能提供・保守に必要な最小限に限定します。
        </p>

        <h2>5. 削除依頼窓口</h2>
        <p>
          データ削除依頼は、運営者窓口（例: privacy@access-scan.com）へ対象URL・診断IDを添えて連絡してください。本人確認後、合理的期間内に対応します。
        </p>
      </article>
    </main>
  );
}
