import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: [
        'src/index.ts',
        'src/components/index.ts',
        'src/events/index.ts',
      ],
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        /^lit.*/,
        /^@lit.*/,
        /^@floating-ui.*/,
        /^marked.*/,
        /^highlight.js.*/,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
      treeshake: true,
    }
  },
  plugins: [
    dts({
      tsconfigPath: './tsconfig.json',
      include: ['src/**/*.ts'],
      outDir: 'dist'
    })
  ]
});