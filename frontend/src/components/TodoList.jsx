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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="p-4 rounded-lg bg-red-100 text-red-700">
          <p className="font-semibold">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Todo List
                </h1>
                {/* 添加表單 */}
                <form onSubmit={handleAddTodo} className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTodoTitle}
                      onChange={(e) => setNewTodoTitle(e.target.value)}
                      placeholder="Add new todo"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Add
                    </button>
                  </div>
                </form>

                {/* Todo 列表 */}
                {!todos || todos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No todos yet. Add one above!</p>
                  </div>
                ) : (
                  <ul className="mt-8 space-y-3">
                    {todos.map((todo) => (
                      <li
                        key={todo.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={Boolean(todo.completed)}
                            onChange={() => handleToggle(todo)}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                          />
                          <span
                            className={`${
                              todo.completed
                                ? "line-through text-gray-400"
                                : "text-gray-700"
                            } transition-colors duration-150`}
                          >
                            {todo.title}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDelete(todo.id)}
                          className="ml-2 p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors duration-150"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoList;
