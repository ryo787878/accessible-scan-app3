#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/accessible-scan}"
NGINX_CONF="${NGINX_CONF:-/etc/nginx/conf.d/accessible-scan.conf}"
SERVICE_NAME="${SERVICE_NAME:-accessible-scan}"
DOMAIN="${DOMAIN:-access-scan.com}"
WWW_DOMAIN="${WWW_DOMAIN:-www.access-scan.com}"
APP_PORT="${APP_PORT:-3000}"

if [[ "${EUID}" -eq 0 ]]; then
  echo "Run as a non-root user with sudo privileges."
  exit 1
fi

if [[ ! -f "$APP_DIR/.env" ]]; then
  echo "Missing $APP_DIR/.env"
  exit 1
fi

if [[ ! -f "$NGINX_CONF" ]]; then
  echo "Missing $NGINX_CONF"
  exit 1
fi

echo "[1/5] Update APP_BASE_URL in .env"
if grep -q '^APP_BASE_URL=' "$APP_DIR/.env"; then
  sed -i "s|^APP_BASE_URL=.*|APP_BASE_URL=https://$DOMAIN|" "$APP_DIR/.env"
else
  printf '\nAPP_BASE_URL=https://%s\n' "$DOMAIN" >> "$APP_DIR/.env"
fi

echo "[2/5] Update nginx server_name"
sudo sed -i "s|^[[:space:]]*server_name[[:space:]].*;|    server_name $DOMAIN $WWW_DOMAIN;|" "$NGINX_CONF"

echo "[3/5] Restart app and reload nginx"
sudo systemctl restart "$SERVICE_NAME"
sudo nginx -t
sudo systemctl reload nginx

echo "[4/5] Health checks"
curl -fsS "http://127.0.0.1:$APP_PORT/api/health" >/dev/null
echo "- local app: ok"
curl -fsS -H "Host: $DOMAIN" "http://127.0.0.1/api/health" >/dev/null
echo "- nginx host routing ($DOMAIN): ok"

echo "[5/5] Done"
echo "Next: set Cloudflare DNS A records for $DOMAIN / $WWW_DOMAIN to your VPS IP."
