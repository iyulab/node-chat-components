import { describe, it, expect, afterEach } from 'vitest';
import { page } from 'vitest/browser';
import '../../src/components/blocks/UTableBlock.js';
import type { UTableBlock } from '../../src/components/blocks/UTableBlock.js';

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
});
