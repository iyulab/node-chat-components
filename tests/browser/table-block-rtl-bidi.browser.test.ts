import { describe, it, expect, afterEach } from 'vitest';
import '../../src/components/blocks/UTableBlock.js';
import type { UTableBlock, TableCell } from '../../src/components/blocks/UTableBlock.js';

/**
 * 셀의 글자는 데이터다 — RTL 페이지의 라틴 값(회사명 · 품번)은 페이지가 문단 방향이라 끝의 마침표가 앞으로 간다(".Blue Harbor Co").
 * 값마다 격리(`<bdi>`)해 값이 자기 방향으로 읽히고 칸이 정한 정렬은 그대로다.
 */
afterEach(() => { document.body.replaceChildren(); document.documentElement.dir = 'ltr'; });

const cell = (text: string): TableCell => ({ align: null, text }) as TableCell;

async function edges(dir: 'ltr' | 'rtl', text: string) {
  document.documentElement.dir = dir;
  const el = document.createElement('u-table-block') as UTableBlock;
  el.style.display = 'block';
  el.style.width = '380px';
  el.headers = [cell('Name')];
  el.rows = [[cell(text)]];
  document.body.appendChild(el);
  await el.updateComplete;
  const td = [...el.shadowRoot!.querySelectorAll<HTMLElement>('tbody td')].find((c) => c.textContent?.trim() === text)!;
  const walker = document.createTreeWalker(td, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode() as Text | null;
  while (node && node.data.trim() !== text) node = walker.nextNode() as Text | null;
  const range = document.createRange();
  range.setStart(node!, 0);
  range.setEnd(node!, 1);
  const first = range.getBoundingClientRect();
  range.setStart(node!, node!.data.length - 1);
  range.setEnd(node!, node!.data.length);
  const last = range.getBoundingClientRect();
  return { first: first.left, last: last.left, cell: td.getBoundingClientRect() };
}

describe('u-table-block — 값은 칸 안에서 자기 방향을 지킨다', () => {
  it('RTL 페이지의 라틴 값은 왼쪽에서 오른쪽으로 읽힌다 — 마침표가 마지막 낱말 뒤에 선다', async () => {
    const e = await edges('rtl', 'Blue Harbor Co.');
    expect(e.last).toBeGreaterThan(e.first);
  });

  it('NEGATIVE: LTR 페이지에서는 종전 그대로', async () => {
    const e = await edges('ltr', 'Blue Harbor Co.');
    expect(e.last).toBeGreaterThan(e.first);
    expect(e.first - e.cell.left).toBeLessThan(30);
  });
});
