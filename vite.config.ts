import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// import { globSync } from 'fs';
// import { fileURLToPath } from 'url';
// import path from 'path';

// const files = Object.fromEntries(
//   globSync('src/**/*.ts').map(file => [
//     path.relative(
//       'src',
//       file.slice(0, file.length - path.extname(file).length)
//     ),
//     fileURLToPath(new URL(file, import.meta.url))
//   ])
// );

// console.log('Files: ', files);

export default defineConfig({
  build: {
    target: 'esnext',
    emptyOutDir: true,
    outDir: 'dist',
    lib: {
      formats: ['es'],
      entry: 'src/index.ts',
      fileName: 'main',
    },
    // rollupOptions: {
    //   external: [
    //     /^lit.*/,
    //     /^@lit.*/
    //   ],
    //   treeshake: true,
    // },
  },
  plugins: [
    dts({
      tsconfigPath: './tsconfig.json',
      rollupTypes: true,
      include: ['src/**/*.ts'],
    }),
  ]
});