import { NextResponse } from "next/server"; // NextResponse のインポート
import { verifyAuth } from "@/lib/auth"; // 認証ユーティリティ関数のインポート
import prisma from "@/lib/prisma"; // Prisma クライアントのインポート

/**
 * Todo 一覧取得 API（GET）
 * 認証済みユーザーの Todo リストを返す
 */
export async function GET(req: Request) {
  try {
    // 🔐 ユーザー認証（失敗すると例外が発生）
    const userPayload = await verifyAuth(req as any);

    // 認証ユーザーの Todo をすべて取得
    const todos = await prisma.todo.findMany({
      where: {
        userId: userPayload.userId, // 自分の Todo のみ取得
      },
      orderBy: {
        createdAt: "asc", // 作成日時順で並べ替え
      },
    });

    // 取得成功
    return NextResponse.json(todos, { status: 200 });
  } catch (error: any) {
    // 認証エラーなどの場合
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}

/**
 * Todo 作成 API（POST）
 * 認証済みユーザーに紐づく新しい Todo を作成する
 */
export async function POST(req: Request) {
  try {
    // 🔐 認証チェック
    const userPayload = await verifyAuth(req as any);

    // リクエスト Body の title を取得
    const { title } = await req.json();

    // タイトルが空の場合は 400 エラー
    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    // 新しい Todo を作成
    const newTodo = await prisma.todo.create({
      data: {
        title, // タイトル
        userId: userPayload.userId, // 作成者（ログインユーザー）の ID を設定
      },
    });

    // 作成成功 → 201 Created
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error: any) {
    // 認証失敗などのエラー
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
