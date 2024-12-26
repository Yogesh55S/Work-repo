import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic', // Enable automatic JSX runtime for React 17+
    }),
    commonjs({
      include: [/node_modules/], // Ensure CommonJS modules from node_modules are included
    }),
  ],
  server: {
    hmr: {
      overlay: false, // Disable error overlay in the browser during development
    },
  },
  resolve: {
    alias: {
      react: 'react',
      'react-dom': 'react-dom',
      'react-dom/client': 'react-dom/client.js', // Alias for React DOM client
      'react/jsx-runtime': 'react/jsx-runtime.js', // Explicit alias for JSX runtime
    },
    dedupe: ['react', 'react-dom'], // Deduplicate React dependencies to avoid version conflicts
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'prop-types',
      'react-slick',
      'slick-carousel',
      'swiper',
    ],
    force: true, // Force optimization of dependencies
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/, 'react/jsx-runtime'], // Include mixed CommonJS and ESM modules
      transformMixedEsModules: true, // Transform modules with mixed ES and CommonJS formats
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'], // Mark core React modules as external
      output: {
        manualChunks: {
          // Separate chunks for large libraries
          'react-slick': ['react-slick'],
          swiper: ['swiper'],
        },
      },
    },
  },
});
