import { NextResponse } from "next/server"; // NextResponse のインポート
import { verifyAuth } from "@/lib/auth"; // 認証ユーティリティ関数のインポート

/**
 * 認証済みユーザーのみがアクセスできる保護されたエンドポイント（GET）
 * 認証が成功するとユーザー情報を返す。
 */
export async function GET(req: Request) {
  try {
    // 🔐 JWT 認証チェック
    // verifyAuth 内でトークン検証 → 失敗すると例外発生
    // req を any にキャストしているが、後で型定義を整えることも可能
    const userPayload = await verifyAuth(req as any);

    return NextResponse.json({
      message: "Protected data", // 保護されたデータであることを示すメッセージ
      user: {
        id: userPayload.userId, // JWT に含まれるユーザー ID
        email: userPayload.email, // JWT に含まれるメールアドレス
      },
    });
  } catch (error: any) {
    // 🔐 認証失敗時（JWT 無効・期限切れなど）
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
