import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 開発サーバーを公開
    port: 3000, // ポート3000
    watch: {
      // 開発サーバーのリフレッシュ間隔を大きくする(負荷軽減のため)
      usePolling: true,
      interval: 1000,
    },
  },
});
