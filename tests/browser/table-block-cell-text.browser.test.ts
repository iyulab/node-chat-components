import { describe, it, expect, afterEach, vi } from 'vitest';
import '../../src/components/blocks/UTableBlock.js';
import '../../src/components/blocks/UMarkedBlock.js';
import type { UTableBlock, TableCell } from '../../src/components/blocks/UTableBlock.js';

/**
 * 셀의 `text` 는 글자다 — 서식은 `html` 에 따로 싣는다.
 *
 * 종전에는 `text` 하나가 마크업으로 그려졌다(`unsafeHTML`): 이름이 글자를 약속하는 필드에 사용자 데이터를 넣으면
 * 마크업이 주입됐고, 검색·정렬·CSV/XLS 내려받기가 태그까지 읽었으며, 검색 하이라이트가 마크업 문자열에 `<mark>` 를
 * 끼워 태그·엔티티를 잘랐다.
 */
afterEach(() => document.body.replaceChildren());

const cells = (...texts: Array<string | Partial<TableCell>>): TableCell[] =>
  texts.map((t) => ({ align: null, ...(typeof t === 'string' ? { text: t } : t) }) as TableCell);

async function mount(headers: TableCell[], rows: TableCell[][]) {
  const el = document.createElement('u-table-block') as UTableBlock;
  el.headers = headers;
  el.rows = rows;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

/** 마크다운 표 — 결함이 실제로 살던 경로(렌더러가 서식 셀을 만든다). */
async function markdownTable(md: string) {
  const block = document.createElement('u-marked-block') as HTMLElement & { value: string; updateComplete: Promise<boolean> };
  block.value = md;
  document.body.appendChild(block);
  await block.updateComplete;
  const table = block.shadowRoot!.querySelector('u-table-block') as UTableBlock;
  await table.updateComplete;
  return table;
}

const bodyTexts = (el: UTableBlock) =>
  [...el.shadowRoot!.querySelectorAll('tbody tr')].map((tr) => [...tr.querySelectorAll('td')].map((td) => td.textContent!.trim()));

async function search(el: UTableBlock, q: string) {
  const input = el.shadowRoot!.querySelector('u-input') as HTMLElement & { value: string };
  input.value = q;
  input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  await new Promise((r) => setTimeout(r, 320));
  await el.updateComplete;
}

describe('u-table-block 셀 글자', () => {
  it('🔴`text` 의 마크업은 글자로 보인다 — 요소가 만들어지지 않는다', async () => {
    const el = await mount(cells('<b>Name</b>'), [cells('<img src=x onerror="window.__tbx=1">')]);
    const root = el.shadowRoot!;
    expect(root.querySelector('td img')).toBeNull();
    expect(root.querySelector('th b')).toBeNull();
    expect(root.querySelector('td')!.textContent).toContain('<img src=x');
    expect((window as unknown as { __tbx?: number }).__tbx).toBeUndefined();
  });

  it('`html` 이 있으면 서식으로 그린다', async () => {
    const el = await mount(cells({ text: 'Name', html: '<strong>Name</strong>' }), [cells({ text: 'x', html: '<code>x</code>' })]);
    expect(el.shadowRoot!.querySelector('th strong')?.textContent).toBe('Name');
    expect(el.shadowRoot!.querySelector('td code')?.textContent).toBe('x');
  });

  it('🔴정렬은 `text` 로 — 마크업이 숫자 비교를 깨지 않는다', async () => {
    const el = await markdownTable('| N |\n|---|\n| **10** |\n| **9** |\n| **100** |');
    (el.shadowRoot!.querySelector('.sort-button') as HTMLButtonElement).click();
    await el.updateComplete;
    expect(bodyTexts(el).map((r) => r[0])).toEqual(['9', '10', '100']);
  });

  it('🔴검색은 `text` 로 — 태그 이름은 찾히지 않는다', async () => {
    const el = await markdownTable('| A |\n|---|\n| **bold** |\n| plain |');
    await search(el, 'strong');
    expect(bodyTexts(el)).toEqual([]);
    await search(el, 'bold');
    expect(bodyTexts(el)).toEqual([['bold']]);
  });

  it('🔴하이라이트는 DOM 을 바꾸지 않는다 — 엔티티·태그가 잘리지 않는다', async () => {
    const el = await mount(cells('A'), [cells({ text: 'Tom & Jerry', html: 'Tom &amp; <em>Jerry</em>' }), cells('Jerry Lee')]);
    await search(el, 'jerry');
    const root = el.shadowRoot!;
    expect(root.querySelector('mark')).toBeNull();
    expect(root.querySelector('td em')?.textContent).toBe('Jerry');
    expect(bodyTexts(el)).toEqual([['Tom & Jerry'], ['Jerry Lee']]);
    expect(CSS.highlights.get('u-table-block-search')?.size).toBe(2);
    await search(el, '');
    expect(CSS.highlights.get('u-table-block-search')?.size).toBe(0);
  });

  it('떼어 낸 표는 공유 하이라이트에 범위를 남기지 않는다', async () => {
    const el = await mount(cells('A'), [cells('alpha'), cells('beta')]);
    await search(el, 'a');
    expect(CSS.highlights.get('u-table-block-search')!.size).toBeGreaterThan(0);
    el.remove();
    expect(CSS.highlights.get('u-table-block-search')!.size).toBe(0);
  });

  it('🔴CSV 내려받기는 `text` 를 쓴다 — 태그가 셀로 나가지 않는다', async () => {
    const blobs: Blob[] = [];
    const create = vi.spyOn(URL, 'createObjectURL').mockImplementation((b) => { blobs.push(b as Blob); return 'blob:x'; });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    try {
      const el = await markdownTable('| **Name** |\n|---|\n| `x` |');
      const csvButton = [...el.shadowRoot!.querySelectorAll('u-button')].find((b) => b.textContent!.includes('CSV')) as HTMLElement;
      csvButton.click();
      expect(await blobs[0].text()).toBe('Name\nx');
    } finally {
      create.mockRestore();
      click.mockRestore();
    }
  });

  it('마크다운 표는 셀마다 서식(`html`)과 글자(`text`)를 함께 싣는다', async () => {
    const md = document.createElement('u-marked-block') as HTMLElement & { value: string; updateComplete: Promise<boolean> };
    md.value = '| **Name** | Score |\n|---|---|\n| `a` & b | 9 |';
    document.body.appendChild(md);
    await md.updateComplete;
    const table = md.shadowRoot!.querySelector('u-table-block') as UTableBlock;
    await table.updateComplete;
    expect(table.headers[0]).toMatchObject({ text: 'Name', html: '<strong>Name</strong>' });
    expect(table.rows[0][0].text).toBe('a & b');
    expect(table.shadowRoot!.querySelector('td code')?.textContent).toBe('a');
  });
});
