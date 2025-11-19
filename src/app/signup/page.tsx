"use client"; // React のクライアントコンポーネントとして動作することを指定

import { useState } from "react"; // React の useState フックをインポート
import Link from "next/link"; // Next.js のリンクコンポーネントをインポート
import { useRouter } from "next/navigation"; // Next.js のルーターをインポート

export default function Signup() {
  // 🔤 入力されたメールアドレスとパスワードの状態管理
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 📝 成功またはエラーメッセージ
  const [message, setMessage] = useState("");

  // ⛳ ページ遷移用のフック
  const router = useRouter();

  /**
   * 🚀 ユーザー登録フォーム送信処理
   * - /api/signup に POST リクエスト
   * - 登録成功後はログインページへ遷移
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // フォーム送信によるページリロードを防止
    setMessage(""); // 前回のメッセージをリセット

    try {
      // 🔐 新規登録 API を呼び出し
      const response = await fetch("/api/signup", {
        method: "POST", // POST メソッド
        headers: {
          "Content-Type": "application/json", // JSON 形式で送信
        },
        body: JSON.stringify({ email, password }), // 入力データを送信
      });

      const data = await response.json();

      if (response.ok) {
        // 🎉 登録成功
        setMessage(data.message);

        // ログインページへリダイレクト
        router.push("/login");
      } else {
        // ⚠️ 登録失敗（すでに存在するメールアドレスなど）
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      // 🚫 通信エラーなど
      console.error("Signup error:", error);
      setMessage("An unexpected error occurred.");
    }

    // 入力欄をクリア
    setEmail("");
    setPassword("");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">新規会員登録</h1>

      {/* 新規登録フォーム */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
      >
        {/* メールアドレス入力欄 */}
        <label className="block mb-4">
          <span className="text-gray-700">メールアドレス</span>
          <input
            type="email"
            value={email} // メールアドレス状態を反映
            onChange={(e) => setEmail(e.target.value)} // 入力データを state に反映
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        {/* パスワード入力欄 */}
        <label className="block mb-6">
          <span className="text-gray-700">パスワード</span>
          <input
            type="password"
            value={password} // パスワード状態を反映
            onChange={(e) => setPassword(e.target.value)} // 入力データを state に反映
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
        {message && <p className="mt-4 text-green-600">{message}</p>}
      </form>

      {/* ログインページへのリンク */}
      <p className="mt-6 text-gray-600">
        すでにアカウントをお持ちですか?
        <Link href="/login" className="text-blue-600 hover:underline">
          ログイン
        </Link>
      </p>
    </main>
  );
}
