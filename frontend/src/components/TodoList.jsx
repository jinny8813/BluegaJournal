import { useEffect, useState } from "react";
import { getTodos, createTodo, updateTodo, deleteTodo } from "../services/api";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getTodos();
      // 確保返回的是數組
      setTodos(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch todos");
      console.error("TodoList error:", err);
      setTodos([]); // 錯誤時設置空數組
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 添加新 todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      const newTodo = await createTodo({
        title: newTodoTitle,
        completed: false,
      });
      setTodos([...todos, newTodo]);
      setNewTodoTitle("");
    } catch (err) {
      setError("Failed to add todo");
      console.error("Add todo error:", err);
    }
  };

  // 切換完成狀態
  const handleToggle = async (todo) => {
    try {
      const updatedTodo = await updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t.id === todo.id ? updatedTodo : t)));
    } catch (err) {
      setError("Failed to update todo");
      console.error("Update todo error:", err);
    }
  };

  // 刪除 todo
  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError("Failed to delete todo");
      console.error("Delete todo error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div
          role="status" // 添加這個
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          aria-label="Loading" // 添加這個以提高可訪問性
        >
          <span className="sr-only">Loading...</span>{" "}
          {/* 添加這個用於螢幕閱讀器 */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      <form onSubmit={handleAddTodo} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Add new todo"
            className="flex-1 p-2 border rounded"
            data-testid="todo-input"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            data-testid="add-button"
          >
            Add
          </button>
        </div>
      </form>

      {/* Todo 列表 */}
      {!todos.length ? (
        <p className="text-gray-500 text-center">
          No todos yet. Add one above!
        </p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded"
              data-testid={`todo-item-${todo.id}`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo)}
                  className="w-4 h-4"
                  data-testid={`todo-checkbox-${todo.id}`}
                />
                <span
                  className={todo.completed ? "line-through text-gray-400" : ""}
                >
                  {todo.title}
                </span>
              </div>
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-red-500 hover:text-red-700"
                data-testid={`todo-delete-${todo.id}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;
