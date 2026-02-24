# PostgreSQL引き継ぎメモ

データは破棄前提で、SQLiteからPostgreSQLへ移行する手順です。

## 1. DB作成（VPS）

```bash
sudo -u postgres psql
```

```sql
CREATE ROLE accessible_scan WITH LOGIN PASSWORD 'change-me';
CREATE DATABASE accessible_scan OWNER accessible_scan;
\q
```

## 2. アプリ環境変数

`.env` もしくは systemd の環境変数で以下を設定します。

```dotenv
DATABASE_URL=postgresql://accessible_scan:change-me@127.0.0.1:5432/accessible_scan?schema=public
```

## 3. マイグレーション適用

ローカル開発:

```bash
npx prisma migrate dev --name init_postgres
```

本番/VPS:

```bash
npx prisma migrate deploy
```

## 4. 起動確認

```bash
npm run build
npm run start
curl -s http://127.0.0.1:3000/api/health
```

## 5. 注意

- `prisma/dev.db` は不要（SQLite時代のローカルDB）
- 既存データ移行は行わない前提
