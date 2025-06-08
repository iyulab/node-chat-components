import path from 'node:path';
import { defineConfig, normalizePath } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  build: {
    target: 'esnext',
    outDir: 'dist',
    lib: {
      entry: [
        'src/index.ts',
        'src/components/index.ts',
        'src/internal/index.ts',
      ],
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        /^lit.*/,
        /^@lit.*/,
        /^@floating-ui.*/,
        /^marked.*/,
        /^marked-highlight.*/,
        /^highlight.js.*/,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
      treeshake: true,
    },
    emptyOutDir: true,
  },
  plugins: [
    dts({
      tsconfigPath: './tsconfig.json',
      include: ['src/**/*.ts'],
      outDir: 'dist'
    }),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(path.resolve(__dirname,'./src/assets/styles')),
          dest: 'assets'
        }
      ]
    })
  ]
});
