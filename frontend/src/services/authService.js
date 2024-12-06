import api from "./api";

const authService = {
  // 用戶註冊
  register: async ({ username, email, password, password2 }) => {
    try {
      const response = await api.post("/api/users/register/", {
        username,
        email,
        password,
        password2,
      });

      // 如果註冊成功，自動保存 token
      if (response.data.access) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  // 用戶登入
  login: async ({ username, password }) => {
    try {
      const response = await api.post("/api/users/login/", {
        username,
        password,
      });

      // 保存 token
      if (response.data.access) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  // 用戶登出
  logout: async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.refresh) {
        // 呼叫後端登出 API 使 token 失效
        await api.post("/api/users/logout/", {
          refresh: user.refresh,
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // 無論是否呼叫成功都清除本地存儲
      localStorage.removeItem("user");
    }
  },

  // 刷新 token
  refreshToken: async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.refresh) {
        throw new Error("No refresh token found");
      }

      const response = await api.post("/api/users/token/refresh/", {
        refresh: user.refresh,
      });

      // 更新存儲的 token
      const updatedUser = {
        ...user,
        access: response.data.access,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return response.data;
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error;
    }
  },

  // 獲取當前用戶信息
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  // 更新用戶資料
  updateProfile: async (userData) => {
    try {
      const response = await api.put("/api/users/profile/", userData);
      return response.data;
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  },

  // 修改密碼
  changePassword: async ({ oldPassword, newPassword, newPassword2 }) => {
    try {
      const response = await api.post("/api/users/change-password/", {
        old_password: oldPassword,
        new_password: newPassword,
        new_password2: newPassword2,
      });
      return response.data;
    } catch (error) {
      console.error("Password change failed:", error);
      throw error;
    }
  },

  // 重置密碼請求
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post("/api/users/reset-password/", {
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Password reset request failed:", error);
      throw error;
    }
  },

  // 驗證用戶是否已登入
  isAuthenticated: () => {
    const user = authService.getCurrentUser();
    return !!user?.access;
  },
};

export default authService;
