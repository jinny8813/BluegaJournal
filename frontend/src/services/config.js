import axios from "axios";

// 環境變量配置
const env = import.meta.env.VITE_ENV || "local";

// API 配置
const apiConfig = {
  local: {
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000", // 本地開發用環境變量
    timeout: 10000,
  },
  development: {
    baseURL:
      import.meta.env.VITE_API_BASE_URL || "https://dev.bluegajournal.com:8443", // 開發環境使用相對路徑
    timeout: 15000,
  },
  production: {
    baseURL: "", // 生產環境使用相對路徑
    timeout: 15000,
  },
};

// 服務路徑配置
const servicePaths = {
  home: "/api/",
  csrf: "/api/v1/member/csrf-cookie/",
  auth: {
    base: "/api/v1/member",
    login: "/api/v1/member/login/",
    register: "/api/v1/member/register/",
    profile: "/api/v1/member/profile/",
  },
  blog: {
    base: "/api/blog",
    posts: "/api/blog/posts",
    categories: "/api/blog/categories",
  },
  shop: {
    base: "/api/shop",
    products: "/api/shop/products",
    cart: "/api/shop/cart",
    orders: "/api/shop/orders",
  },
  planner: {
    base: "/api/planner",
    configs: "/api/planner/configs",
    generatePdf: "/api/planner/generate-pdf",
  },
};

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// 創建 axios 實例
const axiosInstance = axios.create({
  baseURL: apiConfig[env].baseURL,
  timeout: apiConfig[env].timeout,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 允許跨域請求攜帶 cookies
});

// 請求攔截器
axiosInstance.interceptors.request.use(
  (config) => {
    const csrfToken = getCookie("csrftoken");
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessages = {
      network: "網絡連接錯誤，請檢查您的網絡連接",
      timeout: "請求超時，請稍後再試",
      server: "服務器錯誤，請稍後再試",
      unauthorized: "請先登入",
      forbidden: "沒有權限訪問",
      notFound: "資源不存在",
    };

    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error(errorMessages.unauthorized);
          break;
        case 403:
          console.error(errorMessages.forbidden);
          break;
        case 404:
          console.error(errorMessages.notFound);
          break;
        default:
          console.error(errorMessages.server);
      }
    } else if (error.code === "ECONNABORTED") {
      console.error(errorMessages.timeout);
    } else {
      console.error(errorMessages.network);
    }

    return Promise.reject(error);
  }
);

export { axiosInstance, servicePaths };
