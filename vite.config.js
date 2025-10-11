import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // Always use root for Vercel
  plugins: [
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    react(),
  ],
  build: {
    target: 'es2018',
    cssCodeSplit: true,
    sourcemap: true, // helpful for Vercel analytics and debugging
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          framer: ['framer-motion'],
        },
      },
    },
  },
  server: {
    host: true, // allow Vercel preview deployments to work
    strictPort: true
  }
});
