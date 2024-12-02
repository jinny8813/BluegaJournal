import { useState, useEffect } from "react";
import { getTodos, createTodo, updateTodo, deleteTodo } from "../services/api";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 獲取所有待辦事項
  const fetchTodos = async () => {
    try {
      const response = await getTodos();
      setTodos(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  // 添加新待辦事項
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await createTodo({ title: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo("");
      setError(null);
    } catch (err) {
      setError("Failed to create todo");
    }
  };

  // 切換待辦事項狀態
  const handleToggle = async (todo) => {
    try {
      const response = await updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t.id === todo.id ? response.data : t)));
      setError(null);
    } catch (err) {
      setError("Failed to update todo");
    }
  };

  // 刪除待辦事項
  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete todo");
    }
  };

  // 初始加載
  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Todo List</h1>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add new todo"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </form>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo)}
                className="h-4 w-4"
              />
              <span
                className={todo.completed ? "line-through text-gray-500" : ""}
              >
                {todo.title}
              </span>
            </div>
            <button
              onClick={() => handleDelete(todo.id)}
              className="px-2 py-1 text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
