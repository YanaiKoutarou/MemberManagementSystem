// NextResponse をインポート（API のレスポンスを返すために使用）
import { NextResponse } from "next/server";
// bcryptjs をインポート（パスワードのハッシュ化に使用）
import bcrypt from "bcryptjs";
// PrismaClient をインポート（データベースへの接続/操作に使用）
import prisma from "@/lib/prisma"; // src/lib/prisma.ts から prisma インスタンスをインポート

// ユーザー登録（POST）API
export async function POST(request: Request) {
  try {
    // リクエストボディから email と password を取得
    const { email, password } = await request.json();

    // email または password が未入力の場合は 400 エラーを返す
    if (!email || !password) {
      return NextResponse.json(
        { message: "メールアドレスとパスワードは必須です。" },
        { status: 400 }
      );
    }

    // 既に同じ email のユーザーが存在しないか確認
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // 存在したら 409 Conflict エラー
    if (existingUser) {
      return NextResponse.json(
        { message: "このメールアドレスは既に登録されています。" },
        { status: 409 }
      );
    }

    // パスワードをハッシュ化（コスト10）
    const hashedPassword = await bcrypt.hash(password, 10);

    // 新規ユーザー作成
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // 登録成功レスポンスを返す
    return NextResponse.json(
      {
        message: "ユーザー登録に成功しました。",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // サーバー側の予期せぬエラー
    return NextResponse.json(
      { message: "ユーザー登録中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
