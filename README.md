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
- `GET /api/health`

## 本番公開（VPS自己ホスト）

本アプリはVPS上での自己ホスト運用を前提としています。  
詳細手順は [`docs/deploy-vps.md`](docs/deploy-vps.md) を参照してください。

概要:

- Cloudflare DNSで新規ドメインをVPSへ向ける
- nginxの別server blockでWordPressとドメイン単位で共存
- nginx reverse proxyで `127.0.0.1:3000` のNext.jsへ転送
- systemdで `next start` を常駐

### `.env` とSQLiteの扱い

- `.env` は本番配布物に含めない（Gitにコミットしない）
- `.env.example` を雛形に本番用 `.env` を手動作成
- SQLite DBファイルは公開ディレクトリ外に配置
  - 例: `DATABASE_URL=file:/var/www/accessible-scan-data/app.db`

### Playwright本番運用の注意

- Playwright実行にはOS依存ライブラリが必要
- VPSメモリやCPUに応じて `SCAN_CONCURRENCY` / `SCAN_PAGE_TIMEOUT_MS` を調整

### ヘルスチェック

```bash
curl -i https://access-scan.com/api/health
```

`status: "ok"` が返れば、Cloudflare/nginx/アプリ疎通確認に利用できます。

## CI/CD（main push -> VPS反映）

`.github/workflows/deploy-vps.yml` を追加しています。  
`main` ブランチにpushすると、GitHub Actionsが以下を実行します。

- `npm ci` / `npm test` / `npm run build`（GitHub Actions上）
- VPSへ `rsync` 配備
- VPSで `npm ci` / `npx prisma generate` / `npx playwright install chromium` / `npm run build`

詳細手順: [`docs/cicd-github-actions.md`](docs/cicd-github-actions.md)

### GitHub Variables（必須）

- `VPS_HOST`: VPSホスト名またはIP
- `VPS_PORT`: SSHポート（通常 `22`）
- `VPS_USER`: SSHユーザー（例: `admin`）
- `VPS_DEPLOY_PATH`: 配備先（例: `/var/www/accessible-scan`）

### GitHub Variables（推奨）

- `VPS_KNOWN_HOSTS`: `ssh-keyscan -H <host>` の結果

### GitHub Secrets

- `VPS_SSH_KEY`（必須）: 秘密鍵（OpenSSH形式、改行込み）

### ドメイン取得後の反映（access-scan.com）

VPSで以下を実行すると、`.env` と nginx `server_name` をまとめて `access-scan.com` に切り替えます。

```bash
cd /var/www/accessible-scan
bash scripts/vps-switch-domain.sh
```

### VPS側の事前設定

- `VPS_USER` が `${VPS_DEPLOY_PATH}` に書き込み可能であること
- GitHub ActionsからのSSHを許可すること

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
