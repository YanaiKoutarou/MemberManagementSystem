import NextAuth, { User, Session, AuthOptions } from "next-auth"; // NextAuth 本体と型のインポート
import { JWT } from "next-auth/jwt"; // JWT 型のインポート
import CredentialsProvider from "next-auth/providers/credentials"; // 認証プロバイダ（Credentials）
import { PrismaAdapter } from "@auth/prisma-adapter"; // Prisma アダプターのインポート
import prisma from "@/lib/prisma"; // Prisma クライアント（DB 接続）
import bcrypt from "bcryptjs"; // パスワードハッシュ化ライブラリ

// NextAuth の設定オプション
const authOptions: AuthOptions = {
  // Prisma アダプターを使用してユーザー情報を DB と紐付け
  adapter: PrismaAdapter(prisma),

  // セッション方式を JWT に設定
  session: {
    strategy: "jwt",
  },

  // カスタムログインページのルート指定
  pages: {
    signIn: "/login",
  },

  // 認証プロバイダ設定（今回は Email/Password の Credentials）
  providers: [
    CredentialsProvider({
      name: "Credentials", // プロバイダ名
      credentials: {
        email: { label: "Email", type: "email" }, // 入力フォームの email
        password: { label: "Password", type: "password" }, // password
      },

      // 認証処理本体（ログインボタン押下時に呼ばれる）
      async authorize(credentials) {
        // email または password が未入力の場合
        if (!credentials?.email || !credentials?.password) {
          throw new Error("メールアドレスとパスワードを入力してください");
        }

        // 入力 email に該当するユーザーを DB から取得
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        // ユーザーが存在しない、またはパスワードが登録されていない場合
        if (!user || !user.password) {
          throw new Error("メールアドレスまたはパスワードが間違っています");
        }

        // 入力されたパスワードとハッシュ化されたパスワードの比較
        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        // パスワード一致時、NextAuth に返すユーザー情報を返す
        if (passwordMatch) {
          return {
            id: user.id,
            email: user.email,
            name: user.name, // ユーザー名（任意）
            image: user.image, // ユーザー画像（任意）
          };
        } else {
          // パスワード不一致
          throw new Error("メールアドレスまたはパスワードが間違っています");
        }
      },
    }),
  ],

  // JWT と Session のコールバック設定
  callbacks: {
    // JWT トークンに追加する情報
    async jwt({ token, user }: { token: JWT; user: User }) {
      // ログイン時のみ user が存在する
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    // クライアント側で使う session オブジェクトに追加する情報
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        // session.user が存在する場合のみ代入
        if (session.user) {
          session.user.id = token.id as string;
          session.user.email = token.email as string;
        }
      }
      return session;
    },
  },
};

// NextAuth のハンドラー生成
const { handlers } = NextAuth(authOptions);

// GET メソッド処理（NextAuth 用）
export async function GET(req: Request, ctx: any) {
  return handlers.GET(req, ctx);
}

// POST メソッド処理（NextAuth 用）
export async function POST(req: Request, ctx: any) {
  return handlers.POST(req, ctx);
}
