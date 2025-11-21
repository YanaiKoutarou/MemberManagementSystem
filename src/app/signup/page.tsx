"use client"; // React のクライアントコンポーネントとして動作することを指定

import { useState } from "react"; // React の useState フックをインポート
import Link from "next/link"; // Next.js のリンクコンポーネントをインポート
import { useRouter } from "next/navigation"; // Next.js のルーターをインポート
import { signUp } from "@/lib/auth-client";

export default function Signup() {
  // 🔤 入力された名前・メールアドレス・パスワードの状態管理
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 📝 成功またはエラーメッセージ
  const [message, setMessage] = useState("");

  // ⛳ ページ遷移用フック
  const router = useRouter();

  /**
   * 🚀 ユーザー登録フォーム送信処理
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signUp.email({
        name,
        email,
        password,
      });
      if (result.error) {
        setMessage(result.error.message || "Signup failed");
      } else {
        router.push("/login");
      }
    } catch (error) {
      setMessage("エラーが発生しました");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">新規会員登録</h1>

      {/* 新規登録フォーム */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
      >
        {/* 名前入力欄 */}
        <label className="block mb-4">
          <span className="text-gray-700">名前</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        {/* メールアドレス入力欄 */}
        <label className="block mb-4">
          <span className="text-gray-700">メールアドレス</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        {/* パスワード入力欄 */}
        <label className="block mb-6">
          <span className="text-gray-700">パスワード</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        {/* 登録ボタン */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          登録
        </button>

        {/* 成功 / 失敗メッセージ */}
        {message && <p className="mt-4 text-red-600">{message}</p>}
      </form>

      {/* ログインページへのリンク */}
      <p className="mt-6 text-gray-600">
        すでにアカウントをお持ちですか?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          ログイン
        </Link>
      </p>
    </main>
  );
}
