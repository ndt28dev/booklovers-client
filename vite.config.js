import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // base: "/",
  plugins: [react()],
  define: { global: "window" },
  server: {
    port: 8080,
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 8080,
    },
  },
});
