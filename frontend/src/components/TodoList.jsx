import { useEffect, useState } from "react";
import { getTodos, createTodo, updateTodo, deleteTodo } from "../services/api";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  // 獲取所有 todos
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch todos");
      console.error("TodoList error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加載
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="todo-list">
      {/* 添加新 todo 的表單 */}
      <form onSubmit={handleAddTodo} className="add-todo-form">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Add new todo"
          className="todo-input"
        />
        <button type="submit" className="add-button">
          Add Todo
        </button>
      </form>

      {/* Todo 列表 */}
      {todos.length === 0 ? (
        <p>No todos found</p>
      ) : (
        <ul className="todos">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo)}
              />
              <span className={todo.completed ? "completed" : ""}>
                {todo.title}
              </span>
              <button
                onClick={() => handleDelete(todo.id)}
                className="delete-button"
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
