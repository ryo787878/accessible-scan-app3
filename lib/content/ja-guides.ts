export type JaGuideLink = {
  title: string;
  description: string;
  href: string;
};

export const jaBlogLinks: JaGuideLink[] = [
  {
    title: "Webアクセシビリティ チェック実践ガイド",
    description: "チェック観点と改善フローを、実務運用に沿って整理した解説記事です。",
    href: "/ja/blog/accessibility-check-guide",
  },
];

export const jaCompareLinks: JaGuideLink[] = [
  {
    title: "アクセシビリティ チェックツール比較",
    description: "導入前に確認すべき比較軸を、短時間で把握できるページです。",
    href: "/ja/compare/accessibility-tools",
  },
];

export const jaGlossaryLinks: JaGuideLink[] = [
  {
    title: "WCAGとは？",
    description: "アクセシビリティ診断の基準となるWCAGの基本概念を解説します。",
    href: "/ja/glossary/wcag",
  },
];

export const jaIndustryLinks: JaGuideLink[] = [
  {
    title: "EC向けWebアクセシビリティ診断ガイド",
    description: "購入導線とフォーム改善を重視した業種別ガイドです。",
    href: "/ja/industry/ecommerce",
  },
  {
    title: "公共向けWebアクセシビリティ診断ガイド",
    description: "情報探索と申請導線の改善観点を整理した業種別ガイドです。",
    href: "/ja/industry/public-sector",
  },
  {
    title: "採用向けWebアクセシビリティ診断ガイド",
    description: "募集要項と応募導線に沿って優先観点をまとめた業種別ガイドです。",
    href: "/ja/industry/recruit",
  },
];

export const jaLegalLinks: JaGuideLink[] = [
  {
    title: "Webアクセシビリティ法令対応ハブ",
    description: "法令対応のチェックポイントと、継続運用の論点をまとめた恒久ページです。",
    href: "/ja/legal/compliance",
  },
];

export const jaServiceLinks: JaGuideLink[] = [
  {
    title: "Webアクセシビリティ診断サービス",
    description: "診断範囲、成果物、進行フローをまとめたサービスページです。",
    href: "/ja/service/accessibility-audit",
  },
  {
    title: "診断レポート見本",
    description: "レポートの粒度と確認ポイントを事前に把握できます。",
    href: "/ja/report-sample",
  },
];
