import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "http://3.24.138.130/api" // 生產環境
    : "/api";

// 創建 axios 實例
const api = axios.create({
  baseURL,
  timeout: 10000, // 增加超時時間到 10 秒
  headers: {
    "Content-Type": "application/json",
  },
  // 添加重試配置
  retry: 3,
  retryDelay: 1000,
  // 添加 withCredentials
  withCredentials: false,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

// 添加請求攔截器
api.interceptors.request.use(
  (config) => {
    console.log("Starting Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("Request Error:", error.message);
    return Promise.reject(error);
  }
);

// 添加響應攔截器
api.interceptors.response.use(
  (response) => {
    console.log("Response Received:", {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    const { config } = error;

    // 如果沒有重試配置，直接拋出錯誤
    if (!config || !config.retry) {
      return Promise.reject(error);
    }

    // 設置重試計數
    config.__retryCount = config.__retryCount || 0;

    // 如果已經達到最大重試次數，拋出錯誤
    if (config.__retryCount >= config.retry) {
      console.error("Max retries reached:", {
        url: config.url,
        method: config.method,
        error: error.message,
      });
      return Promise.reject(error);
    }

    // 增加重試計數
    config.__retryCount += 1;

    // 等待延遲
    const backoff = new Promise((resolve) => {
      setTimeout(() => {
        console.log(
          `Retrying request (${config.__retryCount}/${config.retry}):`,
          config.url
        );
        resolve();
      }, config.retryDelay || 1000);
    });

    // 重試請求
    await backoff;
    return api(config);
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
