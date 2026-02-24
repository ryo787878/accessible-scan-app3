# Accessible Scan MVP

Next.js (App Router) + TypeScript モノリスで、Playwright と axe-core による自動アクセシビリティ診断を行う MVP です。

## Node.js バージョン

- 推奨: Node.js 20 以上

## セットアップ

1. 依存関係をインストール

```bash
npm install
```

2. Playwright のブラウザをインストール

```bash
npx playwright install chromium
```

3. Prisma Client を生成

```bash
npx prisma generate
```

4. （推奨）DB スキーマを反映

```bash
npx prisma db push
```

補足: このアプリは起動時に SQLite テーブルの存在確認と作成を行うため、`db push` が未実行でも MVP 動作は可能です。

## 起動

```bash
npm run dev
```

- トップ: `http://localhost:3000/`
- 進捗: `http://localhost:3000/scan/[publicId]`
- レポート: `http://localhost:3000/report/[publicId]`

## テスト

```bash
npm test
```

型チェック:

```bash
npx tsc --noEmit
```

ビルド:

```bash
npm run build
```

## API

- `POST /api/scans`
- `GET /api/scans/[publicId]`
- `GET /api/scans/[publicId]/report`

## 手動確認シナリオ

1. 正常サイト（静的）
- 例: `https://example.com`
- 期待: `completed` でレポート表示

2. JS レンダリングあり
- 例: SPA サイト
- 期待: Playwright レンダリング後の DOM で axe 実行

3. タイムアウト URL
- 期待: 該当ページのみ `failed`（`timeout`）

4. 404 / 存在しない URL
- 期待: 該当ページ `http_error` で失敗、全体は継続

5. 一部ページのみ失敗するサイト
- 期待: 全体 `completed`、失敗ページ情報を含むレポートが表示

## 既知の制限

- 同一プロセス内ジョブ実行（外部キュー未使用）
- レート制限はインメモリ実装
- 完全な法的適合保証は行わない

## 注意

この診断は自動チェックです。手動監査は含みません。
