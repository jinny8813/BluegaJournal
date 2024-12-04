import axios from "axios";

// 直接使用相對路徑，不需要環境變量
const api = axios.create({
  baseURL: "/api", // 始終使用相對路徑
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// 添加請求攔截器
api.interceptors.request.use(
  (config) => {
    console.log("Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullUrl: `${window.location.origin}${config.baseURL}${config.url}`,
    });
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// API 函數
export const getTodos = async () => {
  try {
    console.log("Fetching todos...");
    const response = await api.get("/todos/");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch todos:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    // 返回空數組而不是拋出錯誤
    return [];
  }
};

export const createTodo = async (todo) => {
  try {
    console.log("Creating todo:", todo);
    const response = await api.post("/todos/", todo);
    return response.data;
  } catch (error) {
    console.error("Failed to create todo:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const updateTodo = async (id, todo) => {
  try {
    console.log("Updating todo:", { id, todo });
    const response = await api.put(`/todos/${id}/`, todo);
    return response.data;
  } catch (error) {
    console.error("Failed to update todo:", {
      id,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const deleteTodo = async (id) => {
  try {
    console.log("Deleting todo:", id);
    const response = await api.delete(`/todos/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete todo:", {
      id,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export default api;
