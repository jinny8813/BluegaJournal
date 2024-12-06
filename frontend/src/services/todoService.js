import api from "./api";

const todoService = {
  // 獲取所有 todos
  getTodos: async () => {
    try {
      const response = await api.get("/api/todos/");
      // 確保返回的是數組
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      throw error;
    }
  },

  // 創建新的 todo
  createTodo: async ({ title, completed = false }) => {
    try {
      const response = await api.post("/api/todos/", {
        title,
        completed,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to create todo:", error);
      throw error;
    }
  },

  // 更新 todo
  updateTodo: async (id, todoData) => {
    try {
      const response = await api.put(`/api/todos/${id}/`, todoData);
      return response.data;
    } catch (error) {
      console.error("Failed to update todo:", error);
      throw error;
    }
  },

  // 切換 todo 完成狀態
  toggleTodo: async (todo) => {
    try {
      const response = await api.put(`/api/todos/${todo.id}/`, {
        ...todo,
        completed: !todo.completed,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to toggle todo:", error);
      throw error;
    }
  },

  // 刪除 todo
  deleteTodo: async (id) => {
    try {
      await api.delete(`/api/todos/${id}/`);
      return true;
    } catch (error) {
      console.error("Failed to delete todo:", error);
      throw error;
    }
  },
};

export default todoService;
