import { defineConfig, loadEnv } from "vite"; // 添加 loadEnv 的導入
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      host: true, // 添加這行以允許 Docker 容器外的訪問
      port: 5173, // 指定端口
      proxy:
        mode === "development"
          ? {
              "/api": {
                target: env.VITE_API_URL || "http://localhost:8000", // 添加默認值
                changeOrigin: true,
                secure: false,
              },
            }
          : {},
    },
    build: {
      sourcemap: mode === "development",
      minify: mode === "production",
    },
    optimizeDeps: {
      exclude: ["@rollup/rollup-linux-x64-gnu"],
    },
  };
});
