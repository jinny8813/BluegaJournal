import axios from "axios";

// 使用環境變量或默認值
const API_URL = import.meta.env.VITE_API_URL || "http://3.24.138.130";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// 添加請求攔截器
api.interceptors.request.use(
  (config) => {
    // 移除任何對 localhost 的引用
    const fullUrl = `${window.location.origin}${config.url}`;
    console.log("Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullUrl,
    });
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// 添加響應攔截器
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response.data);
    return response;
  },
  (error) => {
    console.error("Response Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
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
    console.error("Error fetching todos:", error);
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
