// Better Auth の設定を読み込む
// auth は "@/lib/auth" 内で betterAuth(...) の結果として作られた認証オブジェクト
import { auth } from "@/lib/auth";

// Next.js 用のルートハンドラに変換するユーティリティ
// これを使うと、Better Auth の auth.handler を Next.js の API ルートとして扱える
import { toNextJsHandler } from "better-auth/next-js";

// toNextJsHandler に auth を渡すと、
// GET /api/auth/... や POST /api/auth/... などのエンドポイントが自動生成される
// これにより Next.js Route Handlers と Better Auth が接続される
export const { POST, GET } = toNextJsHandler(auth);
