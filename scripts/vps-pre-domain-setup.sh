#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/accessible-scan}"
DATA_DIR="${DATA_DIR:-/srv/accessible-scan-data}"
APP_USER="${APP_USER:-admin}"
APP_GROUP="${APP_GROUP:-admin}"
APP_PORT="${APP_PORT:-3000}"
TEMP_DOMAIN="${TEMP_DOMAIN:-scan.local.test}"
SERVICE_NAME="${SERVICE_NAME:-accessible-scan}"

if [[ "${EUID}" -eq 0 ]]; then
  echo "Run as a normal user with sudo privileges (not root)."
  exit 1
fi

for cmd in node npm npx sudo systemctl nginx; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Missing required command: $cmd"
    exit 1
  fi
done

echo "[1/8] Preparing directories"
sudo mkdir -p "$APP_DIR" "$DATA_DIR"
sudo chown -R "$APP_USER:$APP_GROUP" "$APP_DIR" "$DATA_DIR"
sudo chmod 750 "$DATA_DIR"

echo "[2/8] Installing app dependencies/build"
cd "$APP_DIR"
npm install
npx prisma generate
npm run build

echo "[3/8] Writing .env if missing"
if [[ ! -f "$APP_DIR/.env" ]]; then
  cat > "$APP_DIR/.env" <<ENVVARS
NODE_ENV=production
PORT=$APP_PORT
APP_BASE_URL=http://$TEMP_DOMAIN
DATABASE_URL=file:$DATA_DIR/app.db
SCAN_MAX_PAGES_DEFAULT=10
SCAN_MAX_PAGES_LIMIT=20
SCAN_CONCURRENCY=2
SCAN_PAGE_TIMEOUT_MS=30000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=5
LOG_LEVEL=info
ENVVARS
  chmod 600 "$APP_DIR/.env"
else
  echo "Skip: $APP_DIR/.env already exists"
fi

echo "[4/8] Installing systemd unit"
SYSTEMD_TARGET="/etc/systemd/system/$SERVICE_NAME.service"
if [[ -f "$SYSTEMD_TARGET" ]]; then
  sudo cp "$SYSTEMD_TARGET" "$SYSTEMD_TARGET.bak.$(date +%Y%m%d%H%M%S)"
fi
sudo cp "$APP_DIR/deploy/systemd/accessible-scan.service.example" "$SYSTEMD_TARGET"
sudo sed -i "s|^User=.*|User=$APP_USER|" "$SYSTEMD_TARGET"
sudo sed -i "s|^Group=.*|Group=$APP_GROUP|" "$SYSTEMD_TARGET"
sudo sed -i "s|^WorkingDirectory=.*|WorkingDirectory=$APP_DIR|" "$SYSTEMD_TARGET"

NPM_BIN="$(command -v npm)"
sudo sed -i "s|^ExecStart=.*|ExecStart=$NPM_BIN run start|" "$SYSTEMD_TARGET"

if grep -q '^# EnvironmentFile=/var/www/accessible-scan/.env' "$SYSTEMD_TARGET"; then
  sudo sed -i "s|^# EnvironmentFile=/var/www/accessible-scan/.env|EnvironmentFile=$APP_DIR/.env|" "$SYSTEMD_TARGET"
else
  echo "EnvironmentFile=$APP_DIR/.env" | sudo tee -a "$SYSTEMD_TARGET" >/dev/null
fi

echo "[5/8] Installing nginx conf (temporary domain: $TEMP_DOMAIN)"
NGINX_TARGET="/etc/nginx/conf.d/accessible-scan.conf"
if [[ -f "$NGINX_TARGET" ]]; then
  sudo cp "$NGINX_TARGET" "$NGINX_TARGET.bak.$(date +%Y%m%d%H%M%S)"
fi
sudo cp "$APP_DIR/deploy/nginx/accessible-scan.conf.example" "$NGINX_TARGET"
sudo sed -i "s|your-new-domain.example|$TEMP_DOMAIN|g" "$NGINX_TARGET"

echo "[6/8] Restarting services"
sudo systemctl daemon-reload
sudo systemctl enable --now "$SERVICE_NAME"
sudo nginx -t
sudo systemctl reload nginx

echo "[7/8] Health checks"
curl -fsS "http://127.0.0.1:$APP_PORT/api/health" || true
curl -fsS -H "Host: $TEMP_DOMAIN" "http://127.0.0.1/api/health" || true

echo "[8/8] Done"
echo
echo "Next actions before domain purchase:"
echo "- From your Mac, add /etc/hosts entry: <VPS_IP> $TEMP_DOMAIN"
echo "- Then open: http://$TEMP_DOMAIN/ and http://$TEMP_DOMAIN/api/health"
echo "- When domain is decided, replace TEMP_DOMAIN and APP_BASE_URL with real domain and reload nginx/systemd."
