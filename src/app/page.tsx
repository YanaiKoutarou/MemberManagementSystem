import Link from "next/link"; // Next.js のリンクコンポーネントをインポート

export default function Home() {
  return (
    // ページ全体のレイアウト設定
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      {/* サイトタイトル */}
      <h1 className="text-4xl font-bold text-blue-600 mb-4 text-center">
        TODO管理サイト
      </h1>

      {/* キャッチコピー（説明文） */}
      <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
        あなたのタスクを簡単に整理し、毎日の効率をアップ。
        <br />
        会員登録して、自分専用のTODOリストをすぐに始めましょう。
      </p>

      {/* ボタンエリア（新規登録・ログイン） */}
      <div className="flex gap-4 mb-12">
        {/* 新規登録ページへ移動 */}
        <Link href="/signup">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            新規登録
          </button>
        </Link>

        {/* ログインページへ移動 */}
        <Link href="/login">
          <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition">
            ログイン
          </button>
        </Link>
      </div>
    </main>
  );
}
