import axios from "axios";

// 直接使用固定的 API URL
const API_URL = "http://3.24.138.130/api";

// 創建 axios 實例
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// 請求攔截器
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", {
      method: config.method?.toUpperCase(),
      url: `${API_URL}${config.url}`,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// 響應攔截器
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("API Error:", {
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
    console.log("Fetching todos from:", `${API_URL}/todos/`);
    const response = await api.get("/todos/");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    return [];
  }
};

export const createTodo = async (todo) => {
  try {
    const response = await api.post("/todos/", todo);
    return response.data;
  } catch (error) {
    console.error("Failed to create todo:", error);
    throw error;
  }
};

export const updateTodo = async (id, todo) => {
  try {
    const response = await api.put(`/todos/${id}/`, todo);
    return response.data;
  } catch (error) {
    console.error("Failed to update todo:", error);
    throw error;
  }
};

export const deleteTodo = async (id) => {
  try {
    const response = await api.delete(`/todos/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete todo:", error);
    throw error;
  }
};

export default api;
