import { describe, it, expect, afterEach } from 'vitest';
import '../../src/components/references/URefTag.js';
import '../../src/components/references/URefCard.js';

/**
 * **눈에 안 보이는 안내 문구(«새 탭에서 열림»)는 요소 안에 갇힌다.**
 *
 * 그 문구는 표준 «visually hidden» 모양(`position: absolute` · 1px · `clip-path`)이다. 절대 위치 상자는 **포함 블록까지의**
 * `overflow` 조상에게만 잘린다 — 요소 안에 위치 지정된 조상이 없으면 포함 블록이 문서 전체가 되어, 호스트 앱의
 * `overflow: hidden` 감싸개를 전부 건너 그 정적 위치(긴 답이면 수천 px 아래)에서 **문서를 늘렸다**. 채팅 화면이 문서
 * 스크롤을 얻고, `scrollIntoView` 가 문서를 굴려 대화 위쪽이 잘렸다.
 *
 * 판정은 요청자가 잰 값 그대로다 — 그 문구의 `offsetParent` 가 `body` 이면 샌 것이다.
 */
afterEach(() => document.body.replaceChildren());

async function mount(tag: string, props: Record<string, unknown>): Promise<HTMLElement> {
  // 위치 지정되지 않은 스크롤 상자 안 — 소비자 채팅 목록의 모양.
  const box = document.createElement('div');
  box.style.cssText = 'height: 100px; overflow: auto;';
  const spacer = document.createElement('div');
  spacer.style.height = '3000px';
  const el = document.createElement(tag) as HTMLElement & { updateComplete: Promise<unknown> };
  Object.assign(el, props);
  box.append(spacer, el);
  document.body.appendChild(box);
  await el.updateComplete;
  return el;
}

describe('visually-hidden hint containment', () => {
  for (const [tag, props] of [
    ['u-ref-tag', { href: 'https://example.com' }],
    ['u-ref-card', { url: 'https://example.com', title: 'Example', snippet: 'text' }],
  ] as const) {
    it(`${tag} — the hint's containing block is inside the element, not the document`, async () => {
      const el = await mount(tag, props);
      const hint = el.shadowRoot!.querySelector('.new-tab-hint') as HTMLElement;
      expect(hint).not.toBeNull();
      expect(getComputedStyle(hint).position).toBe('absolute');
      expect(hint.offsetParent).not.toBe(document.body);
      // 문서가 스크롤 상자 바깥으로 늘지 않는다.
      expect(document.documentElement.scrollHeight).toBeLessThanOrEqual(window.innerHeight);
    });
  }
});
