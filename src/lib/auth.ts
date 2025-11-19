import prisma from "./prisma"; // Prisma Client をインポート
import { NextRequest } from "next/server"; // Next.js のリクエスト型
import jwt from "jsonwebtoken"; // JWT を扱うライブラリ

// JWT デコード後のペイロード型
interface UserPayload {
  userId: string; // ユーザーID
  email: string; // ユーザーのメールアドレス
}

// 認証検証関数
// リクエストに含まれる JWT を検証し、デコードしたユーザー情報を返す
export async function verifyAuth(req: NextRequest): Promise<UserPayload> {
  // クッキーからトークンを取得
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    // トークンがなければ認証エラー
    throw new Error("Unauthorized: No token provided");
  }

  try {
    // JWT を検証してデコード
    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET as string // 秘密鍵で署名を検証
    ) as UserPayload;

    return decoded; // デコードしたユーザー情報を返す
  } catch (error) {
    // トークンが無効な場合
    throw new Error("Unauthorized: Invalid token");
  }
}

// Prisma Client をデフォルトエクスポート
export default prisma;
