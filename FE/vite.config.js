import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.IOT_BASED_FARM / "/IoT-Based-Farm-Management-System-IBFM",
});
