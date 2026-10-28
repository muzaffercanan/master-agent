import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { notesPlugin } from "./scripts/notes-plugin";

export default defineConfig({
  plugins: [react(), notesPlugin()],
  // relative asset paths so dist/ works from any folder or static host
  base: "./",
  server: { port: 5173 },
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});
