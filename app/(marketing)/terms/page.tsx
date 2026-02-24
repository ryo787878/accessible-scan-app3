import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal-page-layout";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "利用規約",
  path: "/terms",
  description: "Accessible Scan の利用規約",
  ogType: "lp",
});

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="利用規約"
      updatedAt="2026-02-24"
      summary="本サービスの利用条件と禁止事項を定めます。診断対象の権限確認とポリシー遵守を前提にご利用ください。"
      sections={[
        {
          title: "1. 対象サイトの権限要件",
          content: <p>本サービスは、利用者が管理権限または明示的な診断権限を持つWebサイトのみを対象とします。</p>,
        },
        {
          title: "2. robots.txt / サイト規約の尊重",
          content: (
            <p>
              本サービスは robots.txt の Disallow を尊重して診断対象を制御します。利用者は対象サイトの利用規約・運用ポリシーを確認し、これを遵守するものとします。
            </p>
          ),
        },
        {
          title: "3. 自動診断の限界",
          content: (
            <p>
              診断結果は自動検出に基づく参考情報です。WCAG適合性の完全判定を保証するものではなく、最終判断には手動監査を推奨します。
            </p>
          ),
        },
        {
          title: "4. 負荷制御のための制限",
          content: (
            <p>
              サービス保護のため、リクエスト回数・同時実行数・診断ページ数等に技術的制限を設けます。制限値は予告なく変更される場合があります。
            </p>
          ),
        },
        {
          title: "5. 禁止行為",
          content: (
            <ul>
              <li>第三者サイトの無断診断</li>
              <li>ログイン突破、認証回避、アクセス制御回避</li>
              <li>robots.txt や利用規約に反するアクセス</li>
              <li>サービス運用を妨げる過剰アクセス、攻撃的利用</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
