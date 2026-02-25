/** axeルールIDから日本語名への変換マップ */
const axeRuleJa: Record<string, string> = {
  "aria-input-field-name": "ARIA入力フィールドにアクセシブル名がない",
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
  "aria-required-children": "必要な子要素が不足しているARIAロールがある",
  "link-in-text-block": "本文中リンクの識別性が不足している",
  "aria-hidden-focus": "フォーカス可能要素がaria-hidden配下にある",
  "image-redundant-alt": "画像の代替テキストが冗長になっている",
  "empty-heading": "空の見出し要素がある",
  region: "コンテンツがランドマーク領域に含まれていない",
  tabindex: "tabindex が0より大きい値になっている",
};

export type RuleGuidanceJa = {
  problem: string;
  why: string;
  howToFix: string[];
  example?: string;
  checkpoints: string[];
  manualMethods?: string[];
  manualPoints?: string[];
};

const detailedGuidanceJa: Record<string, RuleGuidanceJa> = {
  "aria-input-field-name": {
    problem: "ARIA入力フィールドに名前がなく、項目の目的が伝わりません。",
    why: "スクリーンリーダー利用者が入力対象を判断できず、誤入力につながります。",
    howToFix: ["aria-label か aria-labelledby を設定する", "ネイティブ入力は label 要素と関連付ける"],
    example: '<input aria-label="メールアドレス" />',
    checkpoints: ["読み上げ時に項目名が伝わる", "placeholder をラベル代わりにしていない"],
    manualMethods: ["スクリーンリーダー", "キーボード"],
    manualPoints: ["Tab移動時に項目名が読まれる", "目的が前後文脈なしでも理解できる"],
  },
  "link-name": {
    problem: "リンクのテキストや名前から遷移先を判断できません。",
    why: "リンク一覧で目的を比較できず、ナビゲーション効率が大きく落ちます。",
    howToFix: ["リンク文言を具体化する", "必要に応じて aria-label で補足する"],
    example: '<a href="/pricing" aria-label="料金プランを見る">詳細</a>',
    checkpoints: ["単体で読んでも遷移先が分かる", "同一ページ内で同名リンクが乱立していない"],
    manualMethods: ["スクリーンリーダー", "目視"],
    manualPoints: ["リンク一覧で目的を識別できる", "文脈なしでも意味が成立する"],
  },
  "color-contrast": {
    problem: "文字色と背景色のコントラスト比が不足しています。",
    why: "視認性が低下し、弱視ユーザーや明るい環境で読み取りづらくなります。",
    howToFix: ["本文は 4.5:1 以上、太字大文字は 3:1 以上を確保する", "薄いグレー文字を避ける"],
    example: "color: #1f2937; background: #ffffff;",
    checkpoints: ["本文とUIラベルが基準を満たす", "ホバーや無効状態でもコントラストが落ちない"],
    manualMethods: ["目視"],
    manualPoints: ["明るい環境でも読める", "リンク状態変化でも視認性が維持される"],
  },
  "image-alt": {
    problem: "意味のある画像に代替テキストがありません。",
    why: "非視覚ユーザーに情報が伝わらず、内容理解が欠落します。",
    howToFix: ["情報画像には内容を説明する alt を付ける", "装飾画像は alt=\"\" にする"],
    example: '<img src="chart.png" alt="2026年売上推移グラフ" />',
    checkpoints: ["画像がなくても文意が成立する", "ファイル名や冗長語だけの alt になっていない"],
    manualMethods: ["スクリーンリーダー", "目視"],
    manualPoints: ["読み上げ文が画像内容を過不足なく伝える", "装飾画像が読み上げ対象にならない"],
  },
  "button-name": {
    problem: "ボタンに操作名がなく、役割が伝わりません。",
    why: "操作対象を特定できず、誤操作や離脱を招きます。",
    howToFix: ["テキストラベルを設定する", "アイコンのみボタンは aria-label を付ける"],
    example: '<button aria-label="メニューを開く"><MenuIcon /></button>',
    checkpoints: ["読み上げ時に動作を理解できる", "同名ボタンが多すぎない"],
  },
  label: {
    problem: "フォーム項目に対応するラベルがありません。",
    why: "入力ミスが増え、補助技術で項目説明を取得できません。",
    howToFix: ["label の for と input の id を関連付ける", "表示ラベルがない場合は aria-label/aria-labelledby を使う"],
    example: '<label for="email">メール</label><input id="email" />',
    checkpoints: ["ラベルクリックで入力欄にフォーカスする", "必須情報がラベル上で把握できる"],
  },
  "select-name": {
    problem: "セレクトボックスの項目名がありません。",
    why: "何を選択する欄か判断できず、フォーム完了率が低下します。",
    howToFix: ["label で関連付ける", "補足が必要なら aria-label を追加する"],
    checkpoints: ["初回フォーカス時に項目名が読み上げられる", "未選択状態でも目的が分かる"],
  },
  "frame-title": {
    problem: "iframe にタイトルがありません。",
    why: "埋め込みコンテンツの用途が不明で、読み飛ばし判断ができません。",
    howToFix: ["title 属性に内容を短く記述する"],
    example: '<iframe title="お問い合わせフォーム" src="..." />',
    checkpoints: ["複数iframeでタイトルが重複しない", "タイトルだけで内容が推測できる"],
  },
  "document-title": {
    problem: "ページタイトルが未設定か不明瞭です。",
    why: "タブ識別や履歴再訪時の認知負荷が増えます。",
    howToFix: ["title をページ固有にする", "主要キーワードを先頭付近に置く"],
    checkpoints: ["主要ページごとに固有タイトルが設定される"],
  },
  "html-has-lang": {
    problem: "html 要素に言語指定がありません。",
    why: "読み上げ音声や翻訳の精度が低下します。",
    howToFix: ["<html lang=\"ja\"> のように主要言語を設定する"],
    checkpoints: ["多言語ページで言語が適切に切り替わる"],
  },
  "heading-order": {
    problem: "見出しレベルが飛んでおり文書構造が崩れています。",
    why: "見出しジャンプでページ全体像を把握しづらくなります。",
    howToFix: ["h1→h2→h3 の順で階層を維持する", "見た目調整のためだけに見出しタグを使わない"],
    checkpoints: ["見出し一覧で階層が自然につながる"],
  },
  "landmark-one-main": {
    problem: "main ランドマークがありません。",
    why: "本文ジャンプができず、反復ナビゲーションの負荷が増えます。",
    howToFix: ["ページごとに main を1つ配置する"],
    checkpoints: ["ヘッダー/ナビを飛ばして本文に移動できる"],
  },
  "landmark-unique": {
    problem: "同種ランドマークが区別できません。",
    why: "支援技術利用時に目的の領域へ移動しづらくなります。",
    howToFix: ["重複 landmark に aria-label を付与して識別する"],
    checkpoints: ["landmark 一覧で名称重複がない"],
  },
  "duplicate-id": {
    problem: "同一ページ内で ID が重複しています。",
    why: "ラベル関連付けやJS参照が壊れ、予期せぬ挙動になります。",
    howToFix: ["ID を一意に採番する", "繰り返しコンポーネントで prefix を付ける"],
    checkpoints: ["for/id と aria-* 参照先が正しく解決される"],
  },
  "aria-allowed-attr": {
    problem: "要素やロールに許可されない ARIA 属性が設定されています。",
    why: "支援技術の解釈が分かれ、誤情報が伝わる原因になります。",
    howToFix: ["対象ロールで許可される属性だけ残す", "不要な aria-* を削除する"],
    checkpoints: ["role と aria 属性の組み合わせが仕様準拠"],
  },
  "aria-roles": {
    problem: "有効でない ARIA ロールが使われています。",
    why: "要素の意味が不明瞭になり、読み上げ精度が下がります。",
    howToFix: ["有効ロールへ置き換える", "不要なら role 属性を削除する"],
    checkpoints: ["ロール名の綴りと適用先が正しい"],
  },
  "aria-required-children": {
    problem: "ARIA ロールに必須の子要素が不足しています。",
    why: "ウィジェット構造として成立せず、操作不能になります。",
    howToFix: ["ロール仕様に必要な子ロールを追加する"],
    checkpoints: ["親子ロールがセットで成立している"],
  },
  "aria-hidden-focus": {
    problem: "aria-hidden 配下にフォーカス可能要素があります。",
    why: "キーボードで到達できるのに読み上げされず、操作が混乱します。",
    howToFix: ["aria-hidden 配下のフォーカス要素を除去する", "非表示時は tabindex=-1 などでフォーカス不可にする"],
    checkpoints: ["Tab移動先がすべて読み上げ対象になる"],
  },
  region: {
    problem: "主要コンテンツがランドマーク外にあります。",
    why: "領域ジャンプが効かず、ページ理解に時間がかかります。",
    howToFix: ["本文を main/nav/aside/footer など適切なランドマークへ配置する"],
    checkpoints: ["本文と補助情報が役割別に分離される"],
  },
  list: {
    problem: "リスト要素の直下構造が不正です。",
    why: "項目数や階層が正しく伝わらず、理解しづらくなります。",
    howToFix: ["ul/ol の直下は li のみにする", "装飾ラッパーは li の内側へ移動する"],
    checkpoints: ["読み上げで項目数が正しく案内される"],
  },
  listitem: {
    problem: "li がリストコンテナ外にあり構造が壊れています。",
    why: "文書構造エラーで読み上げやスタイルが崩れます。",
    howToFix: ["li を ul/ol 配下へ戻す", "必要なら div + role=listitem を検討する"],
    checkpoints: ["DOM上で li の親が ul/ol である"],
  },
  "nested-interactive": {
    problem: "操作要素が入れ子になっています。",
    why: "フォーカス順やクリック挙動が不安定になり、誤操作を招きます。",
    howToFix: ["button 内の a など二重操作要素を分離する"],
    checkpoints: ["1つのUI要素に操作主体が1つだけになっている"],
  },
};

const quickFixFallbackJa: Record<string, string> = {
  "object-alt": "object要素に代替テキストを提供してください。",
  "aria-allowed-role": "要素に許可されているARIAロールのみを指定してください。",
  "landmark-no-duplicate-contentinfo": "contentinfoランドマークは原則1つに整理してください。",
  "link-in-text-block": "本文リンクは色だけに頼らず、下線などで通常テキストと判別できるようにしてください。",
  "image-redundant-alt": "alt内の『画像』『写真』など冗長語を削除し、内容だけを簡潔に説明してください。",
  "empty-heading": "空の見出しを削除するか、セクション内容を示す見出しテキストを設定してください。",
  tabindex: "tabindexの正値指定を避け、DOM順に沿ってキーボード移動できるようにしてください。",
  "meta-viewport": "user-scalable=no の指定を避け、拡大操作を妨げない viewport 設定にしてください。",
  "aria-hidden-body": "body への aria-hidden 指定を削除し、ページ全体が支援技術から隠れないようにしてください。",
};

/** ルールIDの日本語名を取得（未登録の場合はIDをそのまま返す） */
export function getAxeRuleJa(ruleId: string): string {
  return axeRuleJa[ruleId] ?? ruleId;
}

export function getRuleGuidanceJa(ruleId: string): RuleGuidanceJa | null {
  return detailedGuidanceJa[ruleId] ?? null;
}

export function getQuickFixJa(
  ruleId: string,
  impact?: "critical" | "serious" | "moderate" | "minor" | "unknown"
): string {
  const guidance = getRuleGuidanceJa(ruleId);
  if (guidance) {
    return guidance.howToFix.join(" / ");
  }

  if (quickFixFallbackJa[ruleId]) {
    return quickFixFallbackJa[ruleId];
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
