import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from '@rollup/plugin-commonjs'; // Add CommonJS compatibility

export default defineConfig({
  plugins: [
    react(),
    commonjs(), // Ensure CommonJS compatibility for libraries like jwt-decode
  ],
  optimizeDeps: {
    include: ['jwt-decode'], // Include jwt-decode for pre-bundling
  },
  resolve: {
    alias: {
      // Add any aliases if required
    },
  },
  server: {
    port: 5173, // Set a custom port if needed
  },
});
