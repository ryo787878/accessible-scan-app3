# GitHub Actions で VPS 自動デプロイ

`main` ブランチへ push すると `.github/workflows/deploy-vps.yml` が実行されます。

## 1. GitHub Variables / Secrets 設定

Repository Settings -> Secrets and variables -> Actions で以下を設定してください。

Variables（必須）:

- `VPS_HOST` 例: `219.94.254.232`
- `VPS_PORT` 例: `22`
- `VPS_USER` 例: `admin`
- `VPS_DEPLOY_PATH` 例: `/var/www/accessible-scan`

Variables（推奨）:

- `VPS_KNOWN_HOSTS` 例: `ssh-keyscan -H 219.94.254.232` の出力

Secrets（必須）:

- `VPS_SSH_KEY` 例: `~/.ssh/id_ed25519` の秘密鍵本文

Secrets（推奨）:

- （なし）

## 2. 初回チェック

1. main に push
2. GitHub Actions の `Deploy to VPS` が成功すること
3. VPS側で `npx playwright install chromium` が実行されていること（workflow内）
