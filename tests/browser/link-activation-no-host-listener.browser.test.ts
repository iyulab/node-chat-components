import { describe, it, expect, afterEach } from 'vitest';
import '../../src/components/blocks/UMarkedBlock.js';
import '../../src/components/blocks/UTableBlock.js';
import '../../src/components/references/URefTag.js';
import '../../src/components/references/URefCard.js';

/**
 * 링크 활성화 위임(`link-activate`)은 호스트 **요소**에 `click` 리스너를 걸지 않는다.
 *
 * 요소에 `click` 리스너가 있으면 Chromium 은 그 요소를 «클릭 가능» 으로 접근성 트리에 내놓고, NVDA 는 블록에 들어설 때마다
 * 그것을 말했다(실측: «클릭 가능, 설치 안내 …, 링크»). 위임은 섀도 루트에서 듣는다 — 그래도 링크를 누르면 이벤트가 난다.
 */
afterEach(() => document.body.replaceChildren());

const TAGS = ['u-marked-block', 'u-table-block', 'u-ref-tag', 'u-ref-card'];

describe('link-activate 위임은 호스트 요소에 click 을 걸지 않는다', () => {
  for (const tag of TAGS) {
    it(`${tag}: 연결될 때 호스트에 click · auxclick 리스너가 없다`, async () => {
      const el = document.createElement(tag) as HTMLElement & { updateComplete: Promise<unknown> };
      const registered: string[] = [];
      const original = el.addEventListener.bind(el);
      el.addEventListener = ((type: string, ...rest: unknown[]) => {
        registered.push(type);
        return (original as (...a: unknown[]) => void)(type, ...rest);
      }) as typeof el.addEventListener;
      document.body.appendChild(el);
      await el.updateComplete;
      expect(registered.filter((t) => t === 'click' || t === 'auxclick')).toEqual([]);
    });
  }

  it('그래도 렌더된 링크를 누르면 link-activate 가 나고, 막으면 이동이 막힌다', async () => {
    const block = document.createElement('u-marked-block') as HTMLElement & { value: string; updateComplete: Promise<unknown> };
    block.value = '[Docs](https://example.com/docs)';
    document.body.appendChild(block);
    await block.updateComplete;
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    const seen: string[] = [];
    block.addEventListener('link-activate', (e) => {
      seen.push((e as CustomEvent<{ href: string }>).detail.href);
      e.preventDefault();
    });
    const link = block.shadowRoot!.querySelector('a')!;
    const click = new MouseEvent('click', { bubbles: true, composed: true, cancelable: true });
    link.dispatchEvent(click);
    expect(seen).toEqual(['https://example.com/docs']);
    expect(click.defaultPrevented).toBe(true);
  });
});
