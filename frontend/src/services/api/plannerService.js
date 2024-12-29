import { axiosInstance, servicePaths } from "../config";

export const plannerService = {
  // 獲取所有配置
  async getConfigs() {
    try {
      const response = await axiosInstance.get(servicePaths.planner.configs);
      return response;
    } catch (error) {
      console.error("Failed to fetch configs:", error);
      throw error;
    }
  },
};
