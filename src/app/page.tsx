// src/pages/index.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      
      {/* サイトタイトル */}
      <h1 className="text-4xl font-bold text-blue-600 mb-4 text-center">
        シンプルTODO管理サイト
      </h1>

      {/* キャッチコピー */}
      <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
        あなたのタスクを簡単に整理し、毎日の効率をアップ。  
        会員登録して、自分専用のTODOリストをすぐに始めましょう。
      </p>

      {/* ボタン */}
      <div className="flex gap-4 mb-12">
        <Link href="/signup">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            新規登録
          </button>
        </Link>
        <Link href="/login">
          <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition">
            ログイン
          </button>
        </Link>
      </div>

      {/* 機能紹介 */}
      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold mb-2">TODOリスト管理</h2>
          <p>タスクの追加・編集・完了管理が簡単に操作できます。</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold mb-2">効率的な整理</h2>
          <p>重要なタスクを見逃さず、毎日の効率を最大化します。</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold mb-2">簡単操作</h2>
          <p>誰でもすぐに使えるシンプルなデザインです。</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold mb-2">リアルタイム同期</h2>
          <p>高速キャッシュと同期で、いつでも最新の状態を保持します。</p>
        </div>
      </section>

      {/* フッター */}
      <footer className="mt-16 text-gray-500 text-sm text-center">
        © 2025 シンプルTODO管理サイト. All rights reserved.
      </footer>
    </main>
  );
}
