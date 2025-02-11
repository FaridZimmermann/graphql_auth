import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom", // Needed for React testing
    setupFiles: "./src/tests/setup.ts", // Global setup file
  },
});