import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api" || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  // 如果需要攜帶認證信息
  withCredentials: true,
});

// 添加請求攔截器
api.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// 添加響應攔截器
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  (error) => {
    console.error("Response error:", error);
    return Promise.reject(error);
  }
);

export const getTodos = () => api.get("/todos/");
export const createTodo = (todo) => api.post("/todos/", todo);
export const updateTodo = (id, todo) => api.put(`/todos/${id}/`, todo);
export const deleteTodo = (id) => api.delete(`/todos/${id}/`);
