"use client"; // React のクライアントコンポーネントとして動作することを指定
import { useState, useEffect } from "react"; // React の useState と useEffect フックをインポート
import { useRouter } from "next/navigation"; // Next.js のルーターをインポート
import Link from "next/link"; // Next.js のリンクコンポーネントをインポート

/**
 * TODO の型定義
 */
interface Todo {
  id: string; // Todo の一意な ID
  title: string; // Todo のタイトル
  completed: boolean; // Todo の完了状態
}

export default function TodosPage() {
  // 📝 Todo一覧
  const [todos, setTodos] = useState<Todo[]>([]);

  // ➕ 新しく追加するTodoのタイトル
  const [newTodoTitle, setNewTodoTitle] = useState("");

  // ⚠️ エラーメッセージや通知メッセージ
  const [message, setMessage] = useState("");

  // 🔄 ページ遷移用
  const router = useRouter();

  /**
   * 🎬 初回レンダリング時に Todo一覧を取得
   */
  useEffect(() => {
    fetchTodos();
  }, []);

  /**
   * 📦 Todo一覧を取得する関数
   */
  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos");

      if (response.ok) {
        // 📝 Todoリストの取得成功
        const data = await response.json();
        setTodos(data);
      } else if (response.status === 401) {
        // 🔐 未認証の場合はログインへリダイレクト
        router.push("/login");
      } else {
        setMessage("TODOの取得に失敗しました。");
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      setMessage("TODOの取得中に予期しないエラーが発生しました。");
    }
  };

  /**
   * ➕ 新しい Todo を追加
   */
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTodoTitle }),
      });

      if (response.ok) {
        // フォームをクリアして一覧更新
        setNewTodoTitle("");
        fetchTodos();
      } else if (response.status === 401) {
        router.push("/login");
      } else {
        setMessage("TODOの追加に失敗しました。");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      setMessage("TODOの追加中に予期しないエラーが発生しました。");
    }
  };

  /**
   * 🔄 Todoの完了状態を切り替え
   */
  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !completed }),
      });

      if (response.ok) {
        fetchTodos(); // 更新後一覧を再取得
      } else if (response.status === 401) {
        router.push("/login");
      } else {
        setMessage("TODOの更新に失敗しました。");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      setMessage("TODOの更新中に予期しないエラーが発生しました。");
    }
  };

  /**
   * 🗑️ Todoを削除
   */
  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTodos();
      } else if (response.status === 401) {
        router.push("/login");
      } else {
        setMessage("TODOの削除に失敗しました。");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      setMessage("TODOの削除中に予期しないエラーが発生しました。");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      {/* ページタイトル */}
      <h1 className="text-3xl font-bold text-blue-600 mb-6">TODOリスト</h1>

      {/* Todoを追加するフォーム */}
      <form
        onSubmit={handleAddTodo}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md mb-6"
      >
        <label className="block mb-4">
          <span className="text-gray-700">新しいTODO</span>

          {/* 入力欄 */}
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        {/* 追加ボタン */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          追加
        </button>
      </form>

      {/* メッセージ表示部分 */}
      {message && <p className="mt-4 text-red-600">{message}</p>}

      {/* Todo一覧の表示 */}
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        {todos.length === 0 ? (
          <p className="text-gray-600">
            まだ TODO がありません。上のフォームから追加できます。
          </p>
        ) : (
          <ul>
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex items-center">
                  {/* 完了チェックボックス */}
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() =>
                      handleToggleComplete(todo.id, todo.completed)
                    }
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />

                  {/* タイトル表示（完了なら取り消し線） */}
                  <span
                    className={`ml-3 text-lg ${
                      todo.completed
                        ? "line-through text-gray-500"
                        : "text-gray-900"
                    }`}
                  >
                    {todo.title}
                  </span>
                </div>

                {/* 削除ボタン */}
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ホームに戻るリンク */}
      <p className="mt-6 text-gray-600">
        <Link href="/" className="text-blue-600 hover:underline">
          ホームへ戻る
        </Link>
      </p>
    </main>
  );
}
