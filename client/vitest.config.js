import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  test: {
    plugins: [react()],
    globals: true,
    environment: "jsdom", // Needed for React testing
    setupFiles: "./test/setup.ts", // Global setup file
  },
});