import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import react from "@iyulab/components/plugins/vite-plugin-react-wrapper.js"
import raw from '@iyulab/components/plugins/vite-plugin-glob-resolve.js';

export default defineConfig({
  // 개발용 서버 설정
  server: {
    port: 5174,
    open: 'tests/index.html',
  },

  // 빌드 설정
  build: {
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: false,
    minify: false,
    lib: {
      entry: [
        resolve(__dirname, 'src/index.ts'),
        resolve(__dirname, 'src/chart.ts'),
      ],
      formats: ['es'],
      fileName: (format, entry) => {
        return format === 'es' ? `${entry}.js` : `${entry}.${format}.js`;
      }
    },
    rolldownOptions: {
      external: [
        /^@iyulab.*/,
        /^lit.*/,
        /^chart.js.*/,
        /^marked.*/,
        /^highlight.js.*/,
        /^html2canvas.*/,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
      treeshake: true,
    }
  },
  plugins: [
    dts({
      include: ['src/**/*'],
    }),
    react({
      input: 'src',
      output: 'react',
    }),
    raw(),
  ]
});