import axios from "axios";

// 開發環境使用代理，生產環境使用完整 URL
const API_URL = import.meta.env.DEV
  ? "http://localhost:8000"
  : "https://bluegajournal.com";

// 創建 axios 實例
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 請求攔截器：添加 token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.access) {
      config.headers.Authorization = `Bearer ${user.access}`;
    }

    // 開發環境打印請求信息
    if (import.meta.env.DEV) {
      console.log("API Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log("API Response:", {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // 統一錯誤處理
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    if (import.meta.env.DEV) {
      console.error("API Error:", error);
    }

    return Promise.reject(error);
  }
);

export default api;
