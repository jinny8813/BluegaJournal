import { useState, useEffect } from "react";
import { getTodos, createTodo, updateTodo, deleteTodo } from "../services/api";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await getTodos();
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTodo({ title: newTodo });
      setNewTodo("");
      fetchTodos();
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      await updateTodo(todo.id, { ...todo, completed: !todo.completed });
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Todo
        </button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-2 border-b"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo)}
                className="mr-2"
              />
              <span className={todo.completed ? "line-through" : ""}>
                {todo.title}
              </span>
            </div>
            <button
              onClick={() => handleDelete(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
