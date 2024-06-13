import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  server: {
    host: true, // 開発サーバーを公開
    port: 3000, // ポート3000
    watch: {
      // 開発サーバーのリフレッシュ間隔を大きくする(負荷軽減のため)
      usePolling: true,
      interval: 1000,
    },
    proxy: {
      // 開発サーバーをAPIのプロキシサーバーとする
      "/api": {
        target: "http://backend:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
