import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

// ログイン処理の POST API
export async function POST(req: Request) {
  try {
    // リクエストボディ（email, password）を取得
    const { email, password } = await req.json();

    // 入力チェック（どちらかが空なら 400 エラー）
    if (!email || !password) {
      return NextResponse.json(
        { message: "メールアドレスとパスワードは必須です。" },
        { status: 400 }
      );
    }

    // email からユーザー情報を検索
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // ユーザーが存在しない、またはパスワードが未登録の場合
    if (!user || !user.password) {
      return NextResponse.json(
        { message: "メールアドレスまたはパスワードが間違っています。" },
        { status: 401 }
      );
    }

    // 入力されたパスワードとハッシュ化済みパスワードを比較
    const passwordMatch = await bcrypt.compare(password, user.password);

    // パスワード不一致
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "メールアドレスまたはパスワードが間違っています。" },
        { status: 401 }
      );
    }

    // ここまで来れば認証成功
    // JWT を生成（有効期限は 1時間）
    // ※ NEXTAUTH_SECRET を JWT の秘密鍵として流用
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // ペイロード
      process.env.NEXTAUTH_SECRET as string, // 秘密鍵
      { expiresIn: "1h" } // 有効期限
    );

    // HttpOnly Cookie に JWT を保存
    const cookie = serialize("auth_token", token, {
      httpOnly: true, // JS からアクセス不可（安全性UP）
      secure: process.env.NODE_ENV === "production", // 本番環境のみ Secure 属性
      sameSite: "strict", // CSRF 対策
      maxAge: 60 * 60, // 有効期限 1時間
      path: "/", // 全ルートでクッキー送信
    });

    // 成功レスポンスを返す（リダイレクト先も送信）
    return new NextResponse(
      JSON.stringify({ message: "ログイン成功", redirect: "/todos" }),
      {
        status: 200, // 成功
        headers: {
          "Set-Cookie": cookie, // Cookie をセット
          "Content-Type": "application/json", // JSON レスポンス
        },
      }
    );
  } catch (error) {
    console.error("Login API error:", error);

    // 予期せぬエラー
    return NextResponse.json(
      { message: "予期せぬエラーが発生しました。" },
      { status: 500 }
    );
  }
}
