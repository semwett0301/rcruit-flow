import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    checker({
      typescript: true,
      overlay: { initialIsOpen: false },
    }),
    react(),
    svgr({
      svgrOptions: { plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'] },
    }),
  ],
  server: {
    open: Boolean(process.env.VITE_API_PROXY),
    port: 3000,
  },
});
