import { describe, it, expect, beforeEach } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../../src/components/blocks/UTableBlock.js';
import type { UTableBlock } from '../../src/components/blocks/UTableBlock.js';

/**
 * `u-table-block` 의 열 정렬은 **클릭만 받는 `th`** 였다 — 포커스를 받지 못해 키보드로는 정렬할 수 없었고
 * `aria-sort` 도 없어 보조기술은 정렬 상태를 몰랐다. 타깃 크기 게이트의 «포인터 고아» 검사가 지목했다.
 * 여기서는 트러스티드 키 입력으로 «Tab → Enter 로 정렬되고 `aria-sort` 가 따라온다» 를 잰다.
 */
describe('u-table-block 정렬 — 키보드', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const mount = async (): Promise<UTableBlock> => {
    const el = document.createElement('u-table-block') as UTableBlock;
    el.headers = [{ text: 'Name' }, { text: 'Qty' }] as UTableBlock['headers'];
    el.rows = [
      [{ text: 'b' }, { text: '2' }],
      [{ text: 'a' }, { text: '1' }],
      [{ text: 'c' }, { text: '3' }],
    ] as UTableBlock['rows'];
    document.body.appendChild(el);
    await el.updateComplete;
    return el;
  };

  const firstColumn = (el: UTableBlock) =>
    Array.from(el.shadowRoot!.querySelectorAll('tbody tr td:first-child')).map((td) => td.textContent?.trim());

  it('정렬 버튼은 포커스를 받고 Enter/Space 로 정렬하며, th 의 aria-sort 가 상태를 말한다', async () => {
    const el = await mount();
    const th = () => el.shadowRoot!.querySelectorAll('th')[0];
    const button = th().querySelector<HTMLButtonElement>('button.sort-button')!;
    expect(th().getAttribute('aria-sort')).toBe('none');

    button.focus();
    expect(el.shadowRoot!.activeElement).toBe(button);

    await userEvent.keyboard('{Enter}');
    await el.updateComplete;
    expect(firstColumn(el)).toEqual(['a', 'b', 'c']);
    expect(th().getAttribute('aria-sort')).toBe('ascending');

    await userEvent.keyboard(' ');
    await el.updateComplete;
    expect(firstColumn(el)).toEqual(['c', 'b', 'a']);
    expect(th().getAttribute('aria-sort')).toBe('descending');
  });

  it('누를 면은 헤더 칸 전체다 — 버튼이 th 의 폭을 채운다', async () => {
    const el = await mount();
    const th = el.shadowRoot!.querySelectorAll('th')[1];
    const button = th.querySelector('button.sort-button')!;
    expect(Math.round(button.getBoundingClientRect().width)).toBe(Math.round(th.getBoundingClientRect().width));
  });
});
