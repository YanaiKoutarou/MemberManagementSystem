#!/bin/sh
set -e

echo "Prisma マイグレーションをチェック中..."

# 未適用のマイグレーションがあるか確認
npx prisma migrate deploy

echo "アプリケーションを起動します..."
exec "$@"
