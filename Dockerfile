# Node.js 20 をベースにした軽量 Alpine イメージを使用
FROM node:20-alpine

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# Prisma関連のファイルをコピー
COPY prisma ./prisma

# 環境変数 DATABASE_URL を設定（Prisma 用）
ENV DATABASE_URL="postgresql://user:password@db:5432/mydatabase?schema=public"

# Prisma クライアントを生成
RUN npx prisma generate

# アプリケーションのソースコードを全てコピー
COPY . .

# entrypoint.sh をコピーして実行権限を付与
COPY entrypoint.sh .
RUN chmod +x ./entrypoint.sh

# 開発用サーバーを起動
ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "run", "dev"]