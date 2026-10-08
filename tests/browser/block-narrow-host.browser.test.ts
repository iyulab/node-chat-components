import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '../../src/components/blocks/UTableBlock.js';
import '../../src/components/blocks/UCodeBlock.js';
import '../../src/components/blocks/UFileBlock.js';
import '../../src/components/blocks/UMarkedBlock.js';
import '../../src/components/references/URefCard.js';
import '../../src/components/references/URefTag.js';
import '../../src/components/references/URefCardGroup.js';
import '../../src/components-extra/UChartBlock.js';
import '../../src/components-extra/UImagesBlock.js';
import '../../src/components/blocks/URefBlock.js';
import type { UTableBlock, TableCell } from '../../src/components/blocks/UTableBlock.js';

/**
 * **블록은 놓인 자리의 글자 크기와 폭을 따른다** — 채팅 패널·사이드바처럼 좁고 촘촘한 호스트.
 *
 * | 계약 | 재는 것 |
 * |---|---|
 * | 글자 크기는 호스트를 따른다 | 조상 글자 크기를 두 배로 하면 블록 섀도 안의 모든 글자 크기도 두 배다(px 리터럴이 하나라도 있으면 깨진다) |
 * | 기본 외형은 그대로 | 16px 문맥에서 표 본문 14px · 툴바 12px(종전 리터럴 값) |
 * | 툴바는 겹치지 않는다 | 380px 폭에서 행 수 표기와 내려받기 버튼의 상자가 겹치지 않고 툴바 안에 있다 |
 * | 화면 밖 열이 행을 키우지 않는다 | 380px 폭 · 마지막 열 60자 이상에서 행이 한 줄 높이에 머문다(표는 가로로 스크롤) |
 *
 * ## 왜 이 파일이 생겼는가
 *
 * 채팅 패널(≈380px, 본문 13px)에 마크다운 표를 그리자 셋이 깨졌다 — 툴바가 «N / M rows» 를 덮었고,
 * 오른쪽 열의 긴 글이 좁은 열 안에서 줄바꿈돼 모든 행이 네 줄 높이가 됐고, 표만 14px 로 본문보다 컸다.
 * 셋째의 원인은 표 하나가 아니라 패키지 전체였다 — 블록들이 글자 크기를 px 로 박아 호스트를 무시했다.
 *
 * ## 왜 브라우저인가
 *
 * 계산된 글자 크기·상자 겹침·행 높이는 레이아웃 엔진만 답한다.
 */

let wrap: HTMLDivElement;

beforeEach(() => {
  wrap = document.createElement('div');
  document.body.appendChild(wrap);
});
afterEach(() => {
  wrap.remove();
  document.body.replaceChildren();
});

const settle = async (ms = 200) => {
  await new Promise((r) => requestAnimationFrame(() => r(null)));
  await new Promise((r) => setTimeout(r, ms));
};

type El = HTMLElement & { updateComplete?: Promise<unknown> };

const cell = (text: string): TableCell => ({ text, align: null });

function tableData(rows: number) {
  return {
    headers: ['Id', 'Name', 'Owner', 'State', 'Note'].map(cell),
    rows: Array.from({ length: rows }, (_, i) => [
      cell(String(i + 1)),
      cell(`Item ${i + 1}`),
      cell('Kim'),
      cell('open'),
      cell('A long note that explains the reason in more than sixty characters of text'),
    ]),
  };
}

async function mount(tag: string, props: Record<string, unknown> = {}, fontSize?: string): Promise<El> {
  if (fontSize) wrap.style.fontSize = fontSize;
  const el = document.createElement(tag) as El;
  Object.assign(el, props);
  wrap.appendChild(el);
  await el.updateComplete;
  await settle();
  return el;
}

/** 블록 자신의 섀도 안(중첩 섀도 제외)과 호스트의 계산된 글자 크기. */
function fontSizes(el: Element): Array<{ name: string; size: number }> {
  const label = (n: Element) => n.tagName.toLowerCase() + (n.classList.length ? '.' + [...n.classList].join('.') : '');
  const out = [{ name: ':host', size: parseFloat(getComputedStyle(el).fontSize) }];
  for (const node of el.shadowRoot!.querySelectorAll('*')) {
    if (node.tagName === 'STYLE') continue;
    // 툴팁은 블록 내용이 아니라 떠 있는 층이다 — 전역 글자 단(`--u-text-caption-size`)을 따르는 것이 그 계약이다.
    if (node.closest('u-tooltip')) continue;
    out.push({ name: label(node), size: parseFloat(getComputedStyle(node).fontSize) });
  }
  return out;
}

const blocks: Array<[string, Record<string, unknown>]> = [
  ['u-table-block', tableData(3)],
  ['u-code-block', { lang: 'plaintext', value: 'const a = 1;' }],
  ['u-file-block', { name: 'report.pdf', type: 'application/pdf', size: 2048, removable: true }],
  ['u-ref-card', { type: 'web', title: 'Title', url: 'https://example.com', snippet: 'Snippet', tags: ['a'] }],
  ['u-ref-tag', { href: 'https://example.com' }],
  ['u-ref-card-group', {}],
  ['u-chart-block', { type: 'bar', data: { labels: ['a', 'b'], datasets: [{ label: 'n', data: [1, 2] }] } }],
];

describe('글자 크기는 호스트를 따른다', () => {
  for (const [tag, props] of blocks) {
    it(`${tag} — 조상 글자 크기가 두 배면 섀도 안의 글자 크기도 두 배`, async () => {
      const small = fontSizes(await mount(tag, props, '10px'));
      wrap.replaceChildren();
      const large = fontSizes(await mount(tag, props, '20px'));
      expect(large.length).toBe(small.length);
      const off = small
        .map((s, i) => ({ name: s.name, small: s.size, large: large[i].size }))
        .filter(({ small: s, large: l }) => Math.abs(l - 2 * s) > 0.5);
      expect(off).toEqual([]);
    });
  }

  it('16px 문맥의 기본 외형은 종전과 같다 — 표 본문 14px · 툴바 12px', async () => {
    const el = await mount('u-table-block', tableData(2), '16px');
    const root = el.shadowRoot!;
    expect(getComputedStyle(root.querySelector('td')!).fontSize).toBe('14px');
    expect(getComputedStyle(root.querySelector('.toolbar-count')!).fontSize).toBe('12px');
  });

  it('표의 두 글자 크기는 커스텀 속성으로 바꾼다 — 셀 --table-block-font-size · 툴바 --table-block-meta-font-size', async () => {
    // 최소 글자 크기를 둔 호스트: 툴바는 12px 아래로 내려가지 않고, 셀은 본문과 같다. em 은 쓰이는 자리에서 풀린다.
    // 마운트 전에 조상에 둔다 — 붙인 뒤 바꾸면 u-button 의 전환이 중간값을 보여 준다.
    wrap.style.setProperty('--table-block-meta-font-size', 'max(12px, 0.75em)');
    wrap.style.setProperty('--table-block-font-size', '1em');
    const el = await mount('u-table-block', tableData(2), '14px');
    const root = el.shadowRoot!;
    expect(getComputedStyle(root.querySelector('td')!).fontSize).toBe('14px');
    for (const sel of ['.toolbar-count', '.toolbar-search', '.toolbar-right u-button']) {
      expect([sel, getComputedStyle(root.querySelector(sel)!).fontSize]).toEqual([sel, '12px']);
    }
    // 정렬 아이콘은 셀 글자 크기를 따른다(14 → 12 비율 그대로).
    expect(parseFloat(getComputedStyle(root.querySelector('.sort-icon')!).fontSize)).toBeCloseTo(14 * 12 / 14, 1);
  });

  it('커스텀 속성은 마크다운 블록 섀도 안의 표에도 닿는다 — 바깥에서 상속으로', async () => {
    wrap.style.setProperty('--table-block-meta-font-size', '12px');
    const md = await mount('u-marked-block', { value: ['| A | B |', '|---|---|', '| 1 | 2 |'].join('\n') });
    md.style.fontSize = '13px';
    await settle();
    const table = md.shadowRoot!.querySelector('u-table-block') as UTableBlock | null;
    expect(table).not.toBeNull();
    await table!.updateComplete;
    // 메타만 고정값으로, 셀은 그대로 호스트 비율(13px 의 14/16).
    expect(getComputedStyle(table!.shadowRoot!.querySelector('.toolbar-count')!).fontSize).toBe('12px');
    expect(parseFloat(getComputedStyle(table!.shadowRoot!.querySelector('td')!).fontSize)).toBeCloseTo(13 * 14 / 16, 1);
  });

  it('마크다운 호스트에 준 글자 크기를 그 안의 표가 따른다', async () => {
    const md = await mount('u-marked-block', { value: ['| A | B |', '|---|---|', '| 1 | 2 |'].join('\n') });
    md.style.fontSize = '13px';
    await settle();
    const table = md.shadowRoot!.querySelector('u-table-block') as UTableBlock | null;
    expect(table).not.toBeNull();
    await table!.updateComplete;
    const td = table!.shadowRoot!.querySelector('td')!;
    expect(parseFloat(getComputedStyle(td).fontSize)).toBeCloseTo(13 * 14 / 16, 1);
  });
});

/** 섀도 안에서 글자를 직접 담은 요소(공백 아닌 글 노드를 자식으로 가진 요소)의 계산된 글자 크기. */
function textSizes(el: Element): Array<{ name: string; size: number }> {
  const out: Array<{ name: string; size: number }> = [];
  const label = (n: Element) => n.tagName.toLowerCase() + (n.classList.length ? '.' + [...n.classList].join('.') : '');
  for (const node of el.shadowRoot!.querySelectorAll('*')) {
    if (node.tagName === 'STYLE' || node.closest('u-tooltip')) continue;
    const hasText = [...node.childNodes].some((c) => c.nodeType === Node.TEXT_NODE && c.textContent!.trim() !== '');
    if (hasText) out.push({ name: label(node), size: parseFloat(getComputedStyle(node).fontSize) });
  }
  return out;
}

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
const floorBlocks: Array<[string, Record<string, unknown>]> = [
  ...blocks,
  ['u-ref-block', { title: 'Sources', sources: [{ type: 'web', url: 'https://example.com/a', title: 'A', snippet: 'a' }] }],
  ['u-images-block', { items: [{ src: PIXEL, alt: 'a', caption: 'Caption' }] }],
];

describe('글자 하한 --chat-min-font-size', () => {
  for (const [tag, props] of floorBlocks) {
    it(`${tag} — 14px 문맥에서 하한 12px 이면 섀도 안의 모든 글자가 12px 이상`, async () => {
      wrap.style.setProperty('--chat-min-font-size', '12px');
      const el = await mount(tag, props, '14px');
      const sizes = textSizes(el);
      expect(sizes.length).toBeGreaterThan(0);
      expect(sizes.filter((s) => s.size < 12 - 0.01)).toEqual([]);
    });
  }

  it('하한이 없으면 종전 크기 — 14px 문맥의 u-ref-tag 는 8.75px', async () => {
    const el = await mount('u-ref-tag', { href: 'https://example.com' }, '14px');
    expect(parseFloat(getComputedStyle(el).fontSize)).toBeCloseTo(14 * 10 / 16, 2);
  });

  it('하한은 표 속성 위에도 걸린다 — --table-block-meta-font-size 가 더 작아도 하한이 이긴다', async () => {
    wrap.style.setProperty('--chat-min-font-size', '12px');
    wrap.style.setProperty('--table-block-meta-font-size', '8px');
    const el = await mount('u-table-block', tableData(2), '14px');
    expect(getComputedStyle(el.shadowRoot!.querySelector('.toolbar-count')!).fontSize).toBe('12px');
  });
});

describe('좁은 폭(380px)', () => {
  beforeEach(() => {
    wrap.style.width = '380px';
  });

  it('툴바의 행 수 표기와 내려받기 버튼이 겹치지 않고 툴바 안에 있다', async () => {
    const el = await mount('u-table-block', tableData(40));
    const root = el.shadowRoot!;
    const toolbar = root.querySelector('.toolbar')!.getBoundingClientRect();
    const count = root.querySelector('.toolbar-count')!.getBoundingClientRect();
    const right = root.querySelector('.toolbar-right')!.getBoundingClientRect();
    const overlaps =
      count.left < right.right && right.left < count.right &&
      count.top < right.bottom && right.top < count.bottom;
    expect(overlaps).toBe(false);
    for (const r of [count, right]) {
      expect(r.left).toBeGreaterThanOrEqual(toolbar.left - 0.5);
      expect(r.right).toBeLessThanOrEqual(toolbar.right + 0.5);
    }
  });

  it('화면 밖의 긴 열이 행을 키우지 않는다 — 행은 한 줄 높이, 표는 가로로 스크롤', async () => {
    const el = await mount('u-table-block', tableData(5));
    const root = el.shadowRoot!;
    const wrapper = root.querySelector('.table-wrapper') as HTMLElement;
    const td = root.querySelector('tbody td')!;
    const row = root.querySelector('tbody tr')!.getBoundingClientRect();
    const style = getComputedStyle(td);
    const line = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5;
    const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    expect(row.height).toBeLessThan(2 * line + padding);
    expect(wrapper.scrollWidth).toBeGreaterThan(wrapper.clientWidth);
  });

  it('넓은 호스트에서는 표가 폭을 채운다', async () => {
    wrap.style.width = '1400px';
    const el = await mount('u-table-block', tableData(3));
    const root = el.shadowRoot!;
    const wrapper = root.querySelector('.table-wrapper')!.getBoundingClientRect();
    const table = root.querySelector('table')!.getBoundingClientRect();
    expect(Math.round(table.width)).toBe(Math.round(wrapper.width));
  });
});
