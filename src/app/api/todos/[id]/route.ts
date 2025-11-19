import { NextResponse } from "next/server"; // NextResponse のインポート
import { verifyAuth } from "@/lib/auth"; // 認証ユーティリティ関数のインポート
import prisma from "@/lib/prisma"; // Prisma クライアントのインポート

/**
 * Todo 更新 API（PUT）
 * 認証済みユーザーが自分の Todo を更新するためのエンドポイント
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔐 認証をチェック（認証失敗時は例外が発生）
    const userPayload = await verifyAuth(req as any);

    // URL パラメータを取得（Promise のため await が必要）
    const awaitedParams = await params;
    const { id } = awaitedParams;

    // リクエスト Body から更新データを取得
    const { title, completed } = await req.json();

    // Todo ID が無い場合は 400 エラー
    if (!id) {
      return NextResponse.json(
        { message: "Todo ID is required" },
        { status: 400 }
      );
    }

    // 対象 Todo を DB から取得
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    });

    // Todo が存在しない場合
    if (!existingTodo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    // 🛑 他ユーザーの Todo を更新しようとした場合
    if (existingTodo.userId !== userPayload.userId) {
      return NextResponse.json(
        { message: "Unauthorized to update this todo" },
        { status: 403 }
      );
    }

    // Todo 更新処理（undefined の場合は既存の値を使用）
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existingTodo.title,
        completed: completed !== undefined ? completed : existingTodo.completed,
      },
    });

    // 更新成功
    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error: any) {
    // 認証失敗などのエラー
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}

/**
 * Todo 削除 API（DELETE）
 * 認証済みユーザーが自分の Todo を削除するためのエンドポイント
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔐 ユーザー認証
    const userPayload = await verifyAuth(req as any);

    // URL パラメータを取得
    const awaitedParams = await params;
    const { id } = awaitedParams;

    // Todo ID が無い場合
    if (!id) {
      return NextResponse.json(
        { message: "Todo ID is required" },
        { status: 400 }
      );
    }

    // 対象 Todo を取得
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    });

    // Todo が存在しない場合
    if (!existingTodo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    // 🛑 他ユーザーの Todo を削除しようとした場合
    if (existingTodo.userId !== userPayload.userId) {
      return NextResponse.json(
        { message: "Unauthorized to delete this todo" },
        { status: 403 }
      );
    }

    // Todo 削除実行
    await prisma.todo.delete({
      where: { id },
    });

    // 成功時は 204 No Content を返す
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
