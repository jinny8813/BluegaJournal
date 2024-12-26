import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const config = {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      watch: {
        usePolling: true,
      },
    },
    build: {
      outDir: "dist",
      sourcemap: mode === "development",
      // 生產環境優化
      minify: mode === "production" ? "esbuild" : false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
          },
        },
      },
    },
  };

  if (mode === "development") {
    config.server.proxy = {
      "/api": {
        target: "http://backend:8000",
        changeOrigin: true,
      },
    };
  }

  if (mode === "production") {
    config.build.chunkSizeWarningLimit = 1000;
    config.build.rollupOptions = {
      ...config.build.rollupOptions,
      output: {
        ...config.build.rollupOptions.output,
        // 生產環境的資源文件名格式
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          let extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = "img";
          } else if (/woff|woff2/.test(extType)) {
            extType = "fonts";
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    };
  }

  return config;
});
