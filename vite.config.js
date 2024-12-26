import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic', // Enable automatic JSX runtime
    }),
    commonjs({
      include: [/node_modules/], // Include node_modules
    }),
  ],
  server: {
    hmr: {
      overlay: false, // Disable error overlay in the browser
    },
  },
  resolve: {
    alias: {
      react: 'react',
      'react-dom': 'react-dom',
      'react-slick': 'react-slick',
      'react-dom/client': 'react-dom/client.js',
    },
    dedupe: ['react', 'react-dom', 'react-slick'],
  },
  optimizeDeps: {
    include: ['prop-types', 'react', 'react-dom', 'react-slick', 'slick-carousel','swiper'], // Ensure these problematic lib are pre-bundled
    force: true,
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true, // Transform mixed ES and CommonJS modules
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'prop-types','react/jsx-runtime'], // Mark these modules as external
    },
    output: {
      manualChunks: {
        "react-slick": ["react-slick"],
      },
    },
  },
});
