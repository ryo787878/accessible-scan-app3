/** axeルールIDから日本語名への変換マップ */
const axeRuleJa: Record<string, string> = {
  "color-contrast": "色のコントラスト比が不十分",
  "image-alt": "画像に代替テキストがない",
  label: "フォーム要素にラベルがない",
  "link-name": "リンクにアクセシブルな名前がない",
  "heading-order": "見出しレベルの順序が不正",
  "html-has-lang": "html要素にlang属性がない",
  "meta-viewport": "ビューポートの拡大が無効化されている",
  "button-name": "ボタンにアクセシブルな名前がない",
  "document-title": "ページにタイトルがない",
  list: "リスト構造が不正",
  "aria-allowed-attr": "許可されていないARIA属性が使用されている",
  "aria-hidden-body": "bodyにaria-hidden属性が設定されている",
  "aria-roles": "無効なARIAロールが使用されている",
  "duplicate-id": "重複するIDが存在する",
  "frame-title": "iframeにタイトルがない",
  "landmark-one-main": "メインランドマークが存在しない",
  "landmark-unique": "ランドマークが重複している",
  "landmark-no-duplicate-contentinfo": "contentinfoランドマークが重複している",
  "select-name": "セレクト要素にアクセシブルな名前がない",
  listitem: "リスト項目の構造が不正",
  "nested-interactive": "インタラクティブ要素が入れ子になっている",
  "object-alt": "object要素に代替テキストがない",
  "aria-allowed-role": "許可されていないARIAロールが指定されている",
  region: "コンテンツがランドマーク領域に含まれていない",
  tabindex: "tabindex が0より大きい値になっている",
};

const axeQuickFixJa: Record<string, string> = {
  "image-alt": "装飾画像以外のimgに、内容を説明するalt属性を付けてください。",
  "color-contrast": "本文テキストと背景のコントラスト比を4.5:1以上に調整してください。",
  "link-name": "リンク先の目的が分かるテキスト、またはaria-labelを設定してください。",
  "heading-order": "見出しをh1→h2→h3の順に飛ばさず配置してください。",
  "select-name": "select要素をlabelで関連付けるか、aria-labelを付けてください。",
  listitem: "ul/olの直下をliのみにし、余分なdiv配置を避けてください。",
  "nested-interactive": "button内のaなど、操作要素の入れ子を解消してください。",
  "object-alt": "object要素に代替テキストを提供してください。",
  "aria-allowed-role": "要素に許可されているARIAロールのみを指定してください。",
  "landmark-unique": "同じ役割のランドマークには一意なラベルを付けて区別してください。",
  "landmark-no-duplicate-contentinfo": "contentinfoランドマークは原則1つに整理してください。",
  region: "主要コンテンツをmain/nav/header/footerなどのランドマーク内に配置してください。",
};

/** ルールIDの日本語名を取得（未登録の場合はIDをそのまま返す） */
export function getAxeRuleJa(ruleId: string): string {
  return axeRuleJa[ruleId] ?? ruleId;
}

export function getQuickFixJa(
  ruleId: string,
  impact?: "critical" | "serious" | "moderate" | "minor" | "unknown"
): string {
  if (axeQuickFixJa[ruleId]) {
    return axeQuickFixJa[ruleId];
  }

  switch (impact) {
    case "critical":
      return "操作不能や情報欠落につながる問題です。まず代替テキスト・ラベル・名前付けを優先して修正してください。";
    case "serious":
      return "利用阻害が大きい問題です。コントラストやリンク名など、認知しづらい要素から優先的に修正してください。";
    case "moderate":
      return "構造上の問題です。見出し順序やランドマーク構造を整理して、ナビゲーションしやすい文書構造にしてください。";
    case "minor":
      return "軽微な問題です。ARIA属性や細かなマークアップを整えて品質を高めてください。";
    default:
      return "まず該当要素の役割と名前を明確にし、axeの指摘箇所から1件ずつ修正してください。";
  }
}

/** 重大度の日本語ラベル */
export function getImpactLabel(
  impact: "critical" | "serious" | "moderate" | "minor" | "unknown"
): string {
  const labels: Record<string, string> = {
    critical: "重大",
    serious: "高",
    moderate: "中",
    minor: "低",
    unknown: "未分類",
  };
  return labels[impact] ?? impact;
}
