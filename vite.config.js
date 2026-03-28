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
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;

          if (id.includes('framer-motion')) return 'framer';
          if (id.includes('lucide-react')) return 'admin-vendor';
          if (id.includes('@mdx-js') || id.includes('/katex/')) return 'blog-vendor';
          if (
            id.includes('react-router-dom') ||
            id.includes('react-router') ||
            id.includes('/react-dom/') ||
            id.includes('/react/')
          ) {
            return 'react';
          }

          return undefined;
        },
      },
    },
  },
  server: {
    host: true, // allow Vercel preview deployments to work
    strictPort: true
  }
});
