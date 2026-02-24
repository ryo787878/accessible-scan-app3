# VPS本番公開手順（Cloudflare表示優先）

この手順は、既存WordPress（nginx + php-fpm）稼働中のVPSに、Accessible Scan（Next.js）を別ドメインで追加公開するための最短導線です。

## 1. 前提

- 既存WordPressと同じVPS/同じIPで共存する
- Next.jsは別ドメイン（例: `access-scan.com`）で公開する
- CloudflareでDNS管理する
- アプリはNode.js + `next start`（またはstandalone）で常駐させる
- SQLiteはアプリ公開ディレクトリ外に置く

### 同一IPで複数ドメイン運用できる理由

nginxはHTTPリクエストの `Host` ヘッダを見て `server_name` ごとに振り分けます。
そのため、同じIPでもWordPress用とNext.js用を別server blockで共存できます。

## 2. 推奨配置（本番のみ）

- アプリ: `/var/www/accessible-scan`
- `.env`: `/var/www/accessible-scan/.env` または `/etc/sysconfig/accessible-scan`
- SQLite: `/var/www/accessible-scan-data/app.db`（公開ディレクトリ外）

`app.db` をアプリ本体配下に置くと、将来の`rsync --delete`等で消失リスクがあるため避けてください。

## 3. アプリ準備（手動実行）

```bash
cd /var/www/accessible-scan
npm install
npx prisma generate
npm run build
```

Playwrightを利用するため、OS側に必要ライブラリが必要です。初回は以下も検討してください。

```bash
npx playwright install chromium
```

## 4. 本番環境変数

`.env.example` を基に本番用 `.env` を作成します（Git管理しない）。

必須例:

```dotenv
NODE_ENV=production
PORT=3000
APP_BASE_URL=https://access-scan.com
DATABASE_URL=file:/srv/accessible-scan-data/app.db
```

## 5. systemdで常駐化

`deploy/systemd/accessible-scan.service.example` を参考に `/etc/systemd/system/accessible-scan.service` を作成し、起動します。

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now accessible-scan
sudo systemctl status accessible-scan
```

## 6. nginx設定（WordPressと別ファイル）

`deploy/nginx/accessible-scan.conf.example` を参考に、WordPress設定とは別ファイルで server block を追加します。

```bash
sudo nginx -t
sudo systemctl reload nginx
```

構成は `Cloudflare -> nginx -> http://127.0.0.1:3000 (Next.js)` です。

## 7. Cloudflare公開の最短チェックリスト

1. Cloudflare DNSで `A` レコードを作成し、新ドメインをVPS IPへ向ける
2. `www` を使うなら `www` も `A` または `CNAME` で設計
3. 初回疎通確認はProxyを `DNS only`（灰色）推奨
4. ブラウザでドメイン表示確認後、必要ならProxyをON（橙）
5. SSL設定を整合させる（Cloudflare SSLモードとnginx証明書運用）
6. API/動的ページ（`/api/*`, `/scan/*`, `/report/*`）を不用意にキャッシュしない

## 8. 動作確認

### ローカル（VPS内）

```bash
curl -i http://127.0.0.1:3000/api/health
```

### nginx経由

```bash
curl -i http://access-scan.com/api/health
```

### Cloudflare経由

```bash
curl -i https://access-scan.com/api/health
```

期待値:

- `/` でトップページ表示
- `GET /api/health` で `{"status":"ok",...}`

## 9. 既知の注意点

- Playwright実行にはOS依存ライブラリが必要
- 同時実行数やタイムアウトを高くすると、VPSメモリ不足が起きやすい
- 重いサイト診断時は `SCAN_PAGE_TIMEOUT_MS` の調整が必要
- 本MVPは同一プロセス内ジョブ実行のため、負荷時はレスポンス遅延が起きうる

## 10. 補足

- 本手順は「本番表示できること」優先
- CI/CDを使う場合は `docs/cicd-github-actions.md` を参照
