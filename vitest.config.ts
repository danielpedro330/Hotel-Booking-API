import path from 'path'
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,

    projects: [
      // UNIT
      defineConfig({
        plugins: [tsconfigPaths()],
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "./src"),
          },
        },
        test: {
          name: "unit",
          include: ["src/use-cases/**/*.spec.ts"],
          environment: "node",
        },
      }),

      // E2E
      defineConfig({
        plugins: [tsconfigPaths()],
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "./src"),
          },
        },
        test: {
          name: "e2e",
          include: ["src/http/controllers/**/*.spec.ts"],
          environment: "node",
          setupFiles: ["./vitest.setup.ts"],
          testTimeout: 10000,
        },
      })
]}
})