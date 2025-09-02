import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');
  const isUserPage = repo && repo.endsWith('.github.io');
  const base = process.env.GITHUB_PAGES ? (isUserPage ? '/' : `/${repo || ''}/`) : '/';

  return {
    base,
    plugins: [
      mdx(),
      react(),
    ],
  };
});
