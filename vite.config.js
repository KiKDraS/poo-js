import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
  return {
    base: "/poo-js/",
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
