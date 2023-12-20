import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import cesium from "vite-plugin-cesium";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cesium()],
  base: '/inflightvr'
});
