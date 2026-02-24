# GitHub Actions で VPS 自動デプロイ

`main` ブランチへ push すると `.github/workflows/deploy-vps.yml` が実行されます。

## 1. GitHub Variables / Secrets 設定

Repository Settings -> Secrets and variables -> Actions で以下を設定してください。

Variables（必須）:

- `VPS_HOST` 例: `219.94.254.232`
- `VPS_PORT` 例: `22`
- `VPS_USER` 例: `admin`
- `VPS_DEPLOY_PATH` 例: `/var/www/accessible-scan`
- `VPS_SYSTEMD_SERVICE` 例: `accessible-scan`
- `APP_HEALTHCHECK_URL` 例: `http://127.0.0.1:3000/api/health`

Variables（推奨）:

- `VPS_KNOWN_HOSTS` 例: `ssh-keyscan -H 219.94.254.232` の出力

Secrets（必須）:

- `VPS_SSH_KEY` 例: `~/.ssh/id_ed25519` の秘密鍵本文

Secrets（推奨）:

- `PROD_ENV_FILE` 本番用 `.env` 全文

## 2. `PROD_ENV_FILE` 例

```dotenv
NODE_ENV=production
PORT=3000
APP_BASE_URL=https://access-scan.com
DATABASE_URL=file:/srv/accessible-scan-data/app.db
SCAN_MAX_PAGES_DEFAULT=10
SCAN_MAX_PAGES_LIMIT=20
SCAN_CONCURRENCY=2
SCAN_PAGE_TIMEOUT_MS=30000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=5
LOG_LEVEL=info
```

## 3. VPS 側 sudoers

GitHub Actions のSSHユーザーで、以下コマンドがパスワードなしで実行できる必要があります。

- `systemctl restart accessible-scan`
- `nginx -t`
- `systemctl reload nginx`

例（`visudo`）:

```text
admin ALL=(ALL) NOPASSWD: /bin/systemctl restart accessible-scan, /usr/sbin/nginx -t, /bin/systemctl reload nginx
```

実際のパスは `which systemctl` / `which nginx` で確認してください。

## 4. 初回チェック

1. main に push
2. GitHub Actions の `Deploy to VPS` が成功すること
3. `APP_HEALTHCHECK_URL` が200を返すこと
