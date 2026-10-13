import { describe, it, expect, afterEach } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import '../../src/components/blocks/UTableBlock.js';
import type { UTableBlock } from '../../src/components/blocks/UTableBlock.js';
import { compose, commit } from './ime.js';

/**
 * The table block's search box is named — a placeholder is not a name (it disappears as you type).
 */
afterEach(() => document.body.replaceChildren());

describe('u-table-block search name', () => {
  it('the search box is a named searchbox', async () => {
    const el = document.createElement('u-table-block') as UTableBlock;
    el.headers = [{ text: 'A' }] as UTableBlock['headers'];
    el.rows = [[{ text: '1' }], [{ text: '2' }]] as UTableBlock['rows'];
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 100));
    expect(page.getByRole('searchbox', { name: 'Search rows', exact: true }).elements().length).toBe(1);
  });

  it('the search box keeps its committed search inside the block — no search event leaks out', async () => {
    const el = document.createElement('u-table-block') as UTableBlock;
    el.headers = [{ text: 'A' }] as UTableBlock['headers'];
    el.rows = [[{ text: 'kim' }], [{ text: 'lee' }]] as UTableBlock['rows'];
    document.body.appendChild(el);
    await el.updateComplete;
    const leaked: string[] = [];
    document.body.addEventListener('search', (e) => leaked.push((e as CustomEvent<{ query: string }>).detail?.query));
    const box = page.getByRole('searchbox', { name: 'Search rows', exact: true });
    await userEvent.click(box);
    await userEvent.keyboard('kim{Enter}');
    expect(leaked).toEqual([]);
  });

  it('typing in the search box leaks no input or change out of the block, and still filters', async () => {
    const el = document.createElement('u-table-block') as UTableBlock;
    el.headers = [{ text: 'A' }] as UTableBlock['headers'];
    el.rows = [[{ text: 'kim' }], [{ text: 'lee' }]] as UTableBlock['rows'];
    document.body.appendChild(el);
    await el.updateComplete;
    const leaked: string[] = [];
    for (const type of ['input', 'change']) document.body.addEventListener(type, (e) => leaked.push(e.type));
    const box = page.getByRole('searchbox', { name: 'Search rows', exact: true });
    await userEvent.click(box);
    await userEvent.keyboard('kim');
    await userEvent.tab();
    await new Promise((r) => setTimeout(r, 350));
    await el.updateComplete;
    expect(leaked).toEqual([]);
    expect(el.shadowRoot!.querySelectorAll('tbody tr').length).toBe(1);
  });
});

describe('u-table-block search — IME composition', () => {
  it('rows stay while a syllable is being composed and are filtered by the committed text', async () => {
    const el = document.createElement('u-table-block') as UTableBlock;
    el.headers = [{ text: 'City' }] as UTableBlock['headers'];
    el.rows = [[{ text: '서울' }], [{ text: '성남' }], [{ text: '부산' }]] as UTableBlock['rows'];
    document.body.appendChild(el);
    await el.updateComplete;
    await userEvent.click(page.getByRole('searchbox', { name: 'Search rows', exact: true }));
    const rows = () => el.shadowRoot!.querySelectorAll('tbody tr').length;

    const seen: number[] = [];
    for (const step of ['ㅅ', '서', '성']) {
      await compose([step]);
      await new Promise((r) => setTimeout(r, 300));
      await el.updateComplete;
      seen.push(rows());
    }
    await commit('서');
    await new Promise((r) => setTimeout(r, 300));
    await el.updateComplete;
    seen.push(rows());
    expect(seen).toEqual([3, 3, 3, 1]);
  });
});
