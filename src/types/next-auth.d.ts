import NextAuth, { DefaultSession, DefaultUser } from "next-auth"; // next-auth の型定義を拡張するためのインポート
import { JWT } from "next-auth/jwt"; // JWT 型のインポート

// next-auth モジュールの型拡張
declare module "next-auth" {
  // Session 型の拡張
  interface Session {
    user: {
      id: string; // 独自に追加したユーザーID
    } & DefaultSession["user"]; // 既存の DefaultSession の user プロパティも継承
  }

  // User 型の拡張
  interface User extends DefaultUser {
    id: string; // 独自に追加したユーザーID
  }
}

// next-auth/jwt モジュールの型拡張
declare module "next-auth/jwt" {
  interface JWT {
    id: string; // JWT にも独自のユーザーIDを追加
  }
}
