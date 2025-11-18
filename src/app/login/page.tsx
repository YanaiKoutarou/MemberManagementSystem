// src/pages/login.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

              if (response.ok) {
                setMessage(data.message);
                if (data.redirect) {
                  router.push(data.redirect); // Redirect to the path provided by the API
                } else {
                  router.push("/"); // Fallback to home page or dashboard if redirect is not provided
                }
              } else {        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An unexpected error occurred.");
    }
    setEmail("");
    setPassword("");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">ログイン</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          ログイン
        </button>

        {message && <p className="mt-4 text-green-600">{message}</p>}
      </form>

      <p className="mt-6 text-gray-600">
        アカウントをお持ちでない方は{" "}
        <Link href="/signup" className="text-blue-600 hover:underline">
          新規登録
        </Link>
      </p>
    </main>
  );
}
