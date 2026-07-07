import { IconRegistry } from '@iyulab/components/dist/utilities/icons.js';

/**
 * vite의 `import.meta.glob`을 사용하여 chat-components 전용 SVG 아이콘을 빌드 시점에 번들링합니다.
 * 네트워크 요청 없이 즉시 조회 가능하며, 런타임 동안 불변입니다.
 */
const InternalChatIconBundle = new Map<string, string>(
  Object.entries(import.meta.glob('../assets/icons/*.svg', {
    eager: true,
    query: '?raw',
    import: 'default',
  }))
  .map(([path, module]) => {
    const name = path.split('/').pop()?.replace('.svg', '') || '';
    return [name, module as string] as [string, string];
  })
  .filter(([name]) => name !== ''),
);

// chat-components 내장 아이콘 라이브러리 등록
// - @iyulab/components의 'internal'과 겹치지 않도록 'internal-chat'으로 등록
IconRegistry.register('internal-chat', (name: string) => {
  return InternalChatIconBundle.get(name);
});
