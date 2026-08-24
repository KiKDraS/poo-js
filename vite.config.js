import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
  return {
    publicDir: "public",
    build: {
      outDir: "dist",
      cssMinify: "lightningcss",
    },
    css: {
      transformer: "lightningcss",
    },
  };
});
