import { defineConfig } from 'vite';
import { globSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import dts from 'vite-plugin-dts';

const files = Object.fromEntries(
  globSync('src/**/*.ts').map(file => [
    path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, import.meta.url))
  ])
);

console.log('Files: ', files);

export default defineConfig({
  plugins: [
    dts(), // TypeScript 정의 파일 생성
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
    },
    outDir: 'dist',
    rollupOptions: {
      external: [
        /^lit.*/,
        /^@lit.*/
      ],
      treeshake: true,
    }
  }
});