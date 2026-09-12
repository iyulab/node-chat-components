import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '../../src/components/blocks/UTableBlock.js';
import '../../src/components/blocks/UCodeBlock.js';
import '../../src/components/blocks/UMarkedBlock.js';
import type { UTableBlock } from '../../src/components/blocks/UTableBlock.js';

/**
 * **블록의 높이·스크롤 계약**(cycle-567).
 *
 * | 블록 | 제약이 없을 때 | 호스트에 `max-height` 를 줄 때 |
 * |---|---|---|
 * | `u-table-block` | 표 영역이 **480px 에서 멈추고** 그 안에서 스크롤 | 그 높이를 따른다(=호스트가 이긴다) |
 * | `u-code-block` | **상한 없이** 내용만큼 자란다(가로만 스크롤) | — |
 *
 * ## 왜 이 파일이 생겼는가
 *
 * 🔴`u-table-block` 의 `.table-wrapper` 가 `max-height: 480px` **리터럴**을 들고 있어, 호스트에
 * `max-height` 를 준 소비자의 제약이 **래퍼에 닿지 않았다**. 실측(40행 · 호스트 200px):
 * 호스트는 200 으로 줄지만 래퍼는 **480 그대로**여서 **330px 이 `:host{overflow:hidden}` 에 잘리고**
 * **스크롤바도 없어 도달할 수 없었다** — 표를 짧게 만들려는 정당한 시도가 행을 조용히 삼켰다.
 *
 * ⚠**480px 기본값 자체는 유용하다** — 제약 없는 채팅 스트림에서 긴 표가 화면을 삼키지 않게 한다.
 * 그래서 «기본 상한은 유지하되 호스트 제약이 이긴다» 를 계약으로 고정한다.
 *
 * ★`u-code-block` 은 **세로 상한이 없다**(200줄 → 4151px). 형제와 규약이 갈리지만 **의도된 것**이다:
 * 코드는 접히면 읽을 수 없고, 채팅 스트림 자체가 스크롤을 갖는다. 그 «다름» 을 문서와 여기서 함께 고정한다.
 * ⚠마크다운의 펜스는 **중첩 `u-code-block`** 으로 렌더된다(`UMarkedBlock` 이 위임한다) — 즉 마크다운 안의
 * 코드도 이 계약을 따른다. 그 위임 자체를 고정해 두면, 나중에 렌더 경로가 바뀔 때 계약이 조용히 갈라지지 않는다.
 *
 * ## 왜 브라우저인가
 *
 * 재는 것이 «제약이 어느 요소까지 닿는가» 와 «잘린 것에 스크롤로 도달할 수 있는가» 다 —
 * jsdom 은 박스도 overflow 도 계산하지 않아 원리적으로 답을 줄 수 없다.
 */

const CAP = 480;

let wrap: HTMLDivElement;

beforeEach(() => {
  wrap = document.createElement('div');
  wrap.style.width = '600px';
  document.body.appendChild(wrap);
});
afterEach(() => {
  wrap.remove();
  document.body.replaceChildren();
});

/** marked·highlight.js 는 비동기로 그린다. */
const settle = async (ms = 300) => {
  await new Promise((r) => requestAnimationFrame(() => r(null)));
  await new Promise((r) => setTimeout(r, ms));
};

const h = (el: Element) => Math.round(el.getBoundingClientRect().height);
const part = (host: Element, sel: string) => host.shadowRoot!.querySelector(sel) as HTMLElement;

type El = HTMLElement & { updateComplete?: Promise<unknown> };

async function mountTable(rowCount: number, hostStyle = ''): Promise<UTableBlock & El> {
  const el = document.createElement('u-table-block') as unknown as UTableBlock & El;
  if (hostStyle) el.setAttribute('style', hostStyle);
  el.headers = [{ text: 'A' }, { text: 'B' }] as UTableBlock['headers'];
  const rows: unknown[] = [];
  for (let i = 0; i < rowCount; i++) rows.push([{ text: `r${i}` }, { text: `v${i}` }]);
  el.rows = rows as UTableBlock['rows'];
  wrap.appendChild(el);
  if (el.updateComplete) await el.updateComplete;
  await settle();
  return el;
}

describe('u-table-block — 기본 상한 480px, 호스트 제약이 이긴다', () => {
  it('제약이 없으면 표 영역이 480px 에서 멈추고 그 안에서 스크롤한다', async () => {
    const el = await mountTable(40);
    const wrapper = part(el, '.table-wrapper');
    expect(h(wrapper), '기본 상한').toBe(CAP);
    expect(wrapper.scrollHeight - wrapper.clientHeight, '내용이 넘쳐야 의미가 있다').toBeGreaterThan(0);
    wrapper.scrollTop = 100;
    await new Promise((r) => setTimeout(r, 60));
    expect(wrapper.scrollTop, '표 영역이 실제로 스크롤되어야 한다').toBeGreaterThan(0);
    expect(Math.round(wrapper.getBoundingClientRect().bottom - el.getBoundingClientRect().bottom), '호스트 밖으로 나가지 않는다')
      .toBeLessThanOrEqual(1);
  });

  it('행이 적으면 상한에 닿지 않는다 — 내용 크기다', async () => {
    const el = await mountTable(2);
    const wrapper = part(el, '.table-wrapper');
    expect(h(wrapper)).toBeLessThan(CAP);
    expect(wrapper.scrollHeight - wrapper.clientHeight).toBeLessThanOrEqual(1);
  });

  it('🔴호스트에 max-height 를 주면 그것이 이긴다 — 잘려서 도달 못 하는 행이 없다', async () => {
    const el = await mountTable(40, 'max-height:200px');
    const wrapper = part(el, '.table-wrapper');
    expect(h(el), '호스트는 제약을 따른다').toBeLessThanOrEqual(200);
    // 🔴이 사례가 이 파일이 생긴 이유다: 종전에는 래퍼가 480 을 유지해 330px 이 잘렸다.
    expect(Math.round(wrapper.getBoundingClientRect().bottom - el.getBoundingClientRect().bottom), '래퍼가 호스트 밖으로 나가면 그만큼이 잘려 도달 불가다')
      .toBeLessThanOrEqual(1);
    expect(h(wrapper), '래퍼가 호스트 안에 들어와야 한다').toBeLessThan(200);
    // 그리고 줄어든 만큼은 스크롤로 도달할 수 있어야 한다.
    expect(wrapper.scrollHeight - wrapper.clientHeight).toBeGreaterThan(0);
    wrapper.scrollTop = 100;
    await new Promise((r) => setTimeout(r, 60));
    expect(wrapper.scrollTop, '제약된 표 영역도 실제로 스크롤되어야 한다').toBeGreaterThan(0);
  });
});

describe('u-code-block — 세로 상한이 없다(의도)', () => {
  it('긴 코드는 접히지 않고 내용만큼 자란다 — 세로 스크롤을 만들지 않는다', async () => {
    const el = document.createElement('u-code-block') as El & { value?: string; lang?: string };
    el.lang = 'javascript';
    el.value = Array.from({ length: 200 }, (_, i) => `const x${i} = ${i};`).join('\n');
    wrap.appendChild(el);
    if (el.updateComplete) await el.updateComplete;
    await settle(500);
    const code = part(el, '.hljs');
    expect(h(el), '내용만큼 커진다').toBeGreaterThan(1000);
    expect(code.scrollHeight - code.clientHeight, '세로로 접지 않으므로 세로 스크롤이 없다').toBeLessThanOrEqual(1);
  });
});

describe('u-marked-block — 펜스는 중첩 u-code-block 으로 위임된다', () => {
  it('마크다운 안의 코드도 코드 블록 계약을 따른다 — 위임 자체를 고정한다', async () => {
    const el = document.createElement('u-marked-block') as El & { value?: string };
    el.value = ['# 제목', '', '```js', 'const a = 1;', 'const b = 2;', '```'].join('\n');
    wrap.appendChild(el);
    if (el.updateComplete) await el.updateComplete;
    await settle(600);
    const nested = el.shadowRoot!.querySelector('u-code-block');
    expect(nested, '펜스가 u-code-block 으로 렌더되어야 한다').not.toBeNull();
    // 그 자신의 섀도를 갖는다 = 코드 블록의 계약이 그대로 적용된다.
    expect((nested as HTMLElement).shadowRoot, '중첩 블록이 자기 섀도를 갖는다').not.toBeNull();
  });
});
