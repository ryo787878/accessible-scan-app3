import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal-page-layout";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "Accessible Scan のプライバシーポリシー",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="プライバシーポリシー"
      updatedAt="2026-02-24"
      summary="本サービスで取得・利用・保存するデータの範囲と、削除依頼の受付方針を定めます。"
      sections={[
        {
          title: "1. 収集するデータ",
          content: (
            <ul>
              <li>入力URLおよび正規化URL</li>
              <li>診断結果（ページURL、検出ルール、重大度、エラー情報）</li>
              <li>運用ログ（障害調査・不正利用対策に必要な最小限のアクセス情報）</li>
            </ul>
          ),
        },
        {
          title: "2. 利用目的",
          content: (
            <ul>
              <li>診断機能の提供と結果表示</li>
              <li>障害対応、品質改善、不正利用防止</li>
              <li>法令・規約に基づく対応</li>
            </ul>
          ),
        },
        {
          title: "3. 保存期間",
          content: (
            <p>
              診断データとログは、サービス運用に必要な期間のみ保持し、不要となったデータは順次削除します。詳細な保持期間は運用方針に基づき見直す場合があります。
            </p>
          ),
        },
        {
          title: "4. データ最小化",
          content: (
            <p>
              本サービスは、診断に不要な個人情報を意図的に収集しません。保存項目は機能提供・保守に必要な最小限に限定します。
            </p>
          ),
        },
        {
          title: "5. 削除依頼窓口",
          content: (
            <p>
              データ削除依頼は、運営者窓口（例: privacy@access-scan.com）へ対象URL・診断IDを添えて連絡してください。本人確認後、合理的期間内に対応します。
            </p>
          ),
        },
      ]}
    />
  );
}
