import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'dto',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format !== 'es' ? format : 'js'}`,
    },
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    rollupOptions: {
      external: [],
    },
  },
  plugins: [
    dts({
      entryRoot: 'src',
      outDir: 'dist',
      tsconfigPath: './tsconfig.json',
      copyDtsFiles: false,
    }),
  ],
});
