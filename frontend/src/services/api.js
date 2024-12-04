import axios from "axios";

// 直接寫死 API 地址
const API_BASE_URL = "http://3.24.138.130/api";

// 創建 axios 實例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  // 關閉憑證
  withCredentials: false,
});

// 請求攔截器
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", {
      method: config.method?.toUpperCase(),
      url: `${API_BASE_URL}${config.url}`,
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
    if (error.response) {
      console.error("Server Error:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url,
      });
    } else if (error.request) {
      console.error("No Response:", {
        request: error.request,
        message: error.message,
        url: error.config?.url,
      });
    } else {
      console.error("Request Config Error:", {
        message: error.message,
        url: error.config?.url,
      });
    }
    return Promise.reject(error);
  }
);

// API 函數
export const getTodos = async () => {
  try {
    console.log("Fetching todos from:", `${getBaseUrl()}/todos/`);
    const response = await api.get("/todos/");
    console.log("Todos received:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch todos:", {
      message: error.message,
      config: error.config,
    });
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
