import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// base './' keeps asset paths relative so it works on GitHub Pages or any static host
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
  build: {
    rollupOptions: {
      output: {
        // react/react-dom sengaja tidak di-split: sebagai dependency dari tiap
        // chunk lain, Rollup tetap menaruhnya di entry dan chunk "vendor-react"
        // yang dideklarasikan manual keluar kosong (0 kB).
        manualChunks: {
          "vendor-three": ["three", "@react-three/fiber"],
          "vendor-recharts": ["recharts"],
          "vendor-gsap": ["gsap", "@gsap/react"],
        },
      },
    },
  },
});
