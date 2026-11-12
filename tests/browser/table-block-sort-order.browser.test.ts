import { describe, it, expect, afterEach } from 'vitest';
import { Locale } from '@iyulab/components/dist/utilities/Locale.js';
import '../../src/components/blocks/UTableBlock.js';
import type { UTableBlock, TableCell } from '../../src/components/blocks/UTableBlock.js';

/**
 * 글자 열의 순서 — 숫자 구간은 수로 읽고(`A-2` < `A-10`), 한글이 라틴 앞 / 뒤인지는 브라우저 언어가 아니라
 * 앱 로캘(`Locale.get()`)이 정한다. 같은 표가 브라우저 언어가 다른 두 사람에게 다른 순서를 내지 않는다.
 */
afterEach(() => document.body.replaceChildren());

const cell = (text: string): TableCell => ({ align: null, text }) as TableCell;

async function sortedFirstColumn(): Promise<string[]> {
  const el = document.createElement('u-table-block') as UTableBlock;
  el.headers = [cell('Code')];
  el.rows = ['banana', '가나다', 'Apple', 'A-10', 'A-2', 'A-1'].map((t) => [cell(t)]);
  document.body.appendChild(el);
  await el.updateComplete;
  (el.shadowRoot!.querySelector('.sort-button') as HTMLElement).click();
  await el.updateComplete;
  return [...el.shadowRoot!.querySelectorAll('tbody tr td')].map((td) => td.textContent!.trim());
}

describe('u-table-block 글자 정렬 순서', () => {
  it('숫자 구간을 수로 읽고, 한글의 위치는 앱 로캘이 정한다', async () => {
    const prev = Locale.get();
    try {
      Locale.set('en');
      expect(await sortedFirstColumn()).toEqual(['A-1', 'A-2', 'A-10', 'Apple', 'banana', '가나다']);
      document.body.replaceChildren();
      Locale.set('ko');
      expect(await sortedFirstColumn()).toEqual(['가나다', 'A-1', 'A-2', 'A-10', 'Apple', 'banana']);
    } finally {
      Locale.set(prev);
    }
  });
});
