import { axiosInstance, servicePaths } from "../config";

export const authService = {
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post(
        servicePaths.auth.login,
        credentials
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await axiosInstance.post(
        servicePaths.auth.register,
        userData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    delete axiosInstance.defaults.headers.common["Authorization"];
  },

  getProfile: async () => {
    try {
      const response = await axiosInstance.get(servicePaths.auth.profile);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
