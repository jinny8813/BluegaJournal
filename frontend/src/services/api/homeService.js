import { axiosInstance, servicePaths } from "../config";

export const homeService = {
  getServices: async () => {
    try {
      const response = await axiosInstance.get(servicePaths.home);
      console.log("API Response:", response);
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
};
