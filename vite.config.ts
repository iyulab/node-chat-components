import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import stripCssComments from '@iyulab/components/plugins/vite-plugin-strip-css-comments.js';
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
        resolve(__dirname, 'src/extra.ts'),
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
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
      treeshake: true,
    }
  },
  plugins: [
    // `css` 템플릿 안 주석은 문자열이라 번들러가 지우지 못한다 — 정본 플러그인으로 걷는다(components `plugins/`).
    stripCssComments(),
    dts({
      include: ['src/**/*'],
    }),
    react({
      input: 'src',
      output: 'react',
      exclude: ['src/components-extra/UChartBlock.ts'],
    }),
    raw(),
  ]
});