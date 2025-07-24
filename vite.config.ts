// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    server: {
      // Sử dụng process.env.PORT nếu đang trong môi trường production/deployment,
      // ngược lại dùng 5173 cho dev cục bộ
      port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
      host: true // Quan trọng để lắng nghe tất cả các giao diện mạng
    },
  };
});