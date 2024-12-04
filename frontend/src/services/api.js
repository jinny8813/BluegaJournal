import axios from "axios";

// 創建 axios 實例
const api = axios.create({
  // 根據當前頁面 URL 設置 baseURL
  baseURL: `${window.location.origin}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 請求攔截器
api.interceptors.request.use(
  (config) => {
    // 打印請求信息
    console.log("API Request:", {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
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
    // 打印響應信息
    console.log("API Response:", {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    // 詳細的錯誤處理
    if (error.response) {
      // 服務器返回錯誤
      console.error("Server Error:", {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // 請求發送但沒有收到響應
      console.error("No Response:", {
        request: error.request,
        message: error.message,
      });
    } else {
      // 請求設置有誤
      console.error("Request Config Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// API 函數
export const getTodos = async () => {
  try {
    console.log("Fetching todos from:", `${window.location.origin}/api/todos/`);
    const response = await api.get("/todos/");
    console.log("Todos received:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    // 返回空數組而不是拋出錯誤
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
