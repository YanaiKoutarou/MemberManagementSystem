"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos");
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      } else if (response.status === 401) {
        router.push("/login"); // Redirect to login if unauthorized
      } else {
        setMessage("Failed to fetch todos.");
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      setMessage("An unexpected error occurred while fetching todos.");
    }
  };

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
        setNewTodoTitle("");
        fetchTodos(); // Refresh the list
      } else if (response.status === 401) {
        router.push("/login");
      } else {
        setMessage("Failed to add todo.");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      setMessage("An unexpected error occurred while adding todo.");
    }
  };

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
        fetchTodos(); // Refresh the list
      } else if (response.status === 401) {
        router.push("/login");
      } else {
        setMessage("Failed to update todo.");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      setMessage("An unexpected error occurred while updating todo.");
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTodos(); // Refresh the list
      } else if (response.status === 401) {
        router.push("/login");
      } else {
        setMessage("Failed to delete todo.");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      setMessage("An unexpected error occurred while deleting todo.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Todo List</h1>

      <form onSubmit={handleAddTodo} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md mb-6">
        <label className="block mb-4">
          <span className="text-gray-700">New Todo</span>
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Add Todo
        </button>
      </form>

      {message && <p className="mt-4 text-red-600">{message}</p>}

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        {todos.length === 0 ? (
          <p className="text-gray-600">No todos yet. Add one above!</p>
        ) : (
          <ul>
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo.id, todo.completed)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span
                    className={`ml-3 text-lg ${
                      todo.completed ? "line-through text-gray-500" : "text-gray-900"
                    }`}
                  >
                    {todo.title}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-6 text-gray-600">
        <Link href="/" className="text-blue-600 hover:underline">
          Go to Home
        </Link>
      </p>
    </main>
  );
}
