// better-auth から betterAuth 関数をインポート
import { betterAuth } from "better-auth";

// Prisma を Better Auth に接続するためのアダプタ
import { prismaAdapter } from "better-auth/adapters/prisma";

// Prisma Client をプロジェクトの生成済みクライアントからインポート
import { PrismaClient } from "@/generated/prisma/client";

// Prisma Client のインスタンスを生成
const prisma = new PrismaClient();

// betterAuth を使って認証機能を初期化
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // 使用する DB の種類を指定
  }),
  emailAndPassword: {
    enabled: true,
  },
});
