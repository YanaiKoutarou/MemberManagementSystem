# Node.js 20 をベースにした軽量 Alpine イメージを使用
FROM node:20-alpine

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードを全てコピー
COPY . .

# 環境変数 DATABASE_URL を設定（Prisma 用）
ENV DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# Prisma クライアントを生成
RUN npx prisma generate

# 開発用サーバーを起動
CMD ["npm", "run", "dev"]