import { axiosInstance, servicePaths } from "../config";

export const plannerService = {
  // 獲取所有配置
  async getConfigs(orientation = "horizontal") {
    try {
      const response = await axiosInstance.get(servicePaths.planner.configs, {
        params: { orientation },
      });
      return response;
    } catch (error) {
      console.error("Failed to fetch configs:", error);
      throw error;
    }
  },

  async generatePDF(userSelection) {
    try {
      const response = await axiosInstance.post(
        servicePaths.planner.generatePdf,
        userSelection,
        {
          responseType: "blob",
        }
      );

      return response;
    } catch (error) {
      console.error("PDF 生成失敗:", error);
      throw new Error("PDF 生成失敗");
    }
  },
};
