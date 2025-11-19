# 簡易会員管理システム (React + Next.js + TypeScript + TailwindCSS + PostgreSQL + Redis)

## 概要

このプロジェクトは、学習目的のための簡易会員管理システムです。
主な機能は以下の通りです：

- 会員登録・ログイン・ログアウト機能（NextAuth.js）
- ログイン後にアクセス可能な TODO リスト管理
- データベースは PostgreSQL、ORM は Prisma を使用
- UI は TailwindCSS でスタイリング
- Docker 環境で開発・実行可能

## 学習目標：

- Next.js + TypeScript でのフロントエンド・バックエンド統合
- Prisma を使用した PostgreSQL 操作
- NextAuth.js による認証機能の実装
- TailwindCSS によるスタイリッシュな UI
- Docker での開発環境構築と運用

## 技術スタック

- **フロントエンド**: React, Next.js, TypeScript, TailwindCSS
- **バックエンド**: Next.js API Routes, TypeScript
- **データベース**: PostgreSQL
- **ORM**: Prisma
- **認証**: NextAuth.js
- **開発環境**: Docker, Docker Compose

## ディレクトリ構成
```
.
├── prisma/              # Prisma schema, マイグレーション
├── public/              # 静的ファイル (画像など)
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── api/         # API Routes (認証, TODOなど)
│   │   ├── login/       # ログインページ
│   │   ├── signup/      # 新規登録ページ
│   │   └── todos/       # TODOリストページ
│   ├── lib/             # Prisma client, 認証設定など
│   └── types/           # 型定義ファイル
├── .env.example         # 環境変数ファイルのサンプル
├── docker-compose.yml   # Docker Compose 設定
├── Dockerfile           # Next.js アプリケーションの Dockerfile
├── package.json
└── README.md
```

## 環境構築

### 1. リポジトリをクローン
```bash
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
```

### 2. 環境変数ファイルを作成
`.env.example` を参考に `.env` ファイルを作成します。
```bash
cp .env.example .env
```
`.env` ファイル内の `NEXTAUTH_SECRET` には、`openssl rand -base64 32` などで生成したランダムな文字列を設定してください。

### 3. Docker コンテナを起動
```bash
docker compose up -d --build
```
- **Next.js アプリケーション**: `http://localhost:3000`
- **PostgreSQL**: `localhost:5432`

### 4. データベースのマイグレーション
Dockerコンテナ内で Prisma Migrate を実行し、データベースにテーブルを作成します。
```bash
docker compose exec nextjs-app npx prisma migrate dev --name init
```
`nextjs-app` の部分は `docker-compose.yml` で定義したサービス名に置き換えてください。

### 5. Prisma Client を生成
```bash
docker compose exec nextjs-app npx prisma generate
```

これで、`http://localhost:3000` にアクセスするとアプリケーションが表示されます。

## 操作方法

### 1. 新規登録
- ヘッダーの「新規登録」または `/signup` にアクセスします。
- 名前、メールアドレス、パスワードを入力して登録ボタンを押します。

### 2. ログイン
- ヘッダーの「ログイン」または `/login` にアクセスします。
- 登録したメールアドレスとパスワードでログインします。
- ログインに成功すると、TODOリストページにリダイレクトされます。

### 3. TODO リスト
- ログイン後、`/todos` ページでTODOの追加、表示、更新、削除ができます。

## 主な機能

- **会員管理**
  - **登録**: 名前、メールアドレス、パスワードでユーザーを登録
  - **ログイン**: NextAuth.js の Credentials Provider を使用したログイン
  - **ログアウト**: セッションを破棄

- **TODO リスト管理**
  - **一覧表示**: ログインユーザーに紐づく TODO を表示
  - **追加**: 新規 TODO を登録
  - **更新**: TODO の完了/未完了状態を更新
  - **削除**: TODO を削除
