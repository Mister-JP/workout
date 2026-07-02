import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/workout/",
  plugins: [react()],
  test: {
    environment: "jsdom",
  },
});
