import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    tsconfigPaths(),
    checker({
      typescript: true,
      overlay: { initialIsOpen: false },
    }),
    react(),

    svgr({
      include: '**/*.svg?component',
      svgrOptions: { plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'] },
    }),
  ],
  server: {
    open: Boolean(process.env.VITE_API_PROXY),
    port: 3000,
  },
  assetsInclude: ['**/*.svg', '**/*.png'],
  build: {
    assetsInlineLimit: 0,
  },
}));
