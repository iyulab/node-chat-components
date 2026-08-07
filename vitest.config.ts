import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

// 테스트 전용 설정. vite.config.ts의 빌드 플러그인을 로드하지 않도록
// vitest 전용 config를 분리한다 — 테스트 실행이 dist/를 건드리는
// 부작용을 막기 위함. (packages/components와 동일한 관례)
//
// - browser: 커스텀 엘리먼트의 lifecycle(connectedCallback microtask 등)은 실제
//   브라우저 엔진에서만 재현된다.
// - unit:    소스 규약 대조처럼 DOM 이 필요 없는 검사.
//
// ⚠**`include` 를 좁게 잡으면 그 밖의 테스트는 조용히 실행되지 않는다** — 실패가 아니라
// *부재*로 나타나므로 눈에 띄지 않는다. 프로젝트를 추가할 때 그 반대편도 함께 확인할 것.
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['tests/**/*.test.ts'],
          exclude: ['tests/browser/**'],
          environment: 'node',
        },
      },
      {
        test: {
          name: 'browser',
          include: ['tests/browser/**/*.test.ts'],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
            // 고정 포트 이유는 packages/components/vitest.config.ts 참조 —
            // 이 머신의 Windows 동적 포트 제외 범위와 vitest 기본 포트가
            // 충돌해 EACCES 로 실패하던 것을 실측으로 확인했다.
            api: { host: '127.0.0.1', port: 41503 },
          },
        },
      },
    ],
  },
});
