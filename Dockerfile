# Node 20 ベース
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV DATABASE_URL=DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

RUN npx prisma generate

# 開発用サーバー
CMD ["npm", "run", "dev"]