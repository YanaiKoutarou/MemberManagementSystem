// src/pages/login.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  // 🔤 入力フォームの状態管理（メールアドレスとパスワード）
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 📝 API からのメッセージ（成功 / エラー）
  const [message, setMessage] = useState("");

  // ⛳ ルーター（ページ遷移用）
  const router = useRouter();

  /**
   * 🚀 ログインフォーム送信処理
   * - /api/login に POST
   * - JWT が Cookie にセットされる
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // フォーム送信でページ遷移を防止
    setMessage(""); // 前回のメッセージをクリア

    try {
      // 🔐 ログイン API 呼び出し
      const response = await fetch("/api/login", {
        method: "POST", // POST メソッド
        headers: {
          "Content-Type": "application/json", // JSON 形式で送信
        },
        body: JSON.stringify({ email, password }), // 入力データを送信
      });

      const data = await response.json();

      if (response.ok) {
        // 🎉 ログイン成功
        setMessage(data.message);

        // API 側が redirect を指定している場合はその URL へ遷移
        if (data.redirect) {
          router.push(data.redirect);
        } else {
          router.push("/"); // デフォルトはホームページへ遷移
        }
      } else {
        // ⚠️ ログイン失敗時（パスワード間違いなど）
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      // 🚫 ネットワークエラーなど
      console.error("Login error:", error);
      setMessage("An unexpected error occurred.");
    }

    // 入力欄をクリア
    setEmail("");
    setPassword("");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">ログイン</h1>

      {/* ログインフォーム */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
      >
        {/* メールアドレス入力 */}
        <label className="block mb-4">
          <span className="text-gray-700">メールアドレス</span>
          <input
            type="email"
            value={email} // メールアドレス状態を反映
            onChange={(e) => setEmail(e.target.value)} // 入力を state に反映
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        {/* パスワード入力 */}
        <label className="block mb-6">
          <span className="text-gray-700">パスワード</span>
          <input
            type="password"
            value={password} // パスワード状態を反映
            onChange={(e) => setPassword(e.target.value)} // 入力を state に反映
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        {/* 送信ボタン */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          ログイン
        </button>

        {/* 成功メッセージ表示 */}
        {message && <p className="mt-4 text-green-600">{message}</p>}
      </form>

      {/* 新規登録リンク */}
      <p className="mt-6 text-gray-600">
        アカウントをお持ちでない方は
        <Link href="/signup" className="text-blue-600 hover:underline">
          新規登録
        </Link>
      </p>
    </main>
  );
}
