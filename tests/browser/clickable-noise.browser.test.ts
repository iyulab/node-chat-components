import { describe, it, expect, afterEach } from 'vitest';
import '../../src/components/blocks/UFileBlock.js';
import '../../src/components/blocks/UTableBlock.js';
import '../../src/components/prompt/UPrompt.js';
import { clickableNoise } from './clickable.js';

/**
 * A click-type listener on an element outside a handful of roles has NVDA announce «clickable» (measured — every
 * button whose host carried a listener read as «clickable, button»). Handlers are heard on the shadow root
 * (`delegate` from `@iyulab/components`); the oracle reads the listeners the browser holds (`clickable.ts`).
 */
type El = HTMLElement & { updateComplete?: Promise<unknown>; [k: string]: unknown };

afterEach(() => { document.body.innerHTML = ''; });

const settle = async (box: Element) => {
  for (let i = 0; i < 3; i++) {
    for (const el of box.querySelectorAll('*')) await (el as El).updateComplete;
    await new Promise((r) => setTimeout(r, 50));
  }
};

describe('click-type listeners screen readers would announce as «clickable»', () => {
  it('none on the file, table and prompt blocks', async () => {
    const box = document.createElement('div');
    const file = document.createElement('u-file-block') as unknown as El;
    Object.assign(file, { name: 'a.png', type: 'image/png', size: 10, url: 'data:image/png;base64,iVBORw0KGgo=', removable: true });
    const table = document.createElement('u-table-block') as unknown as El;
    Object.assign(table, { headers: [{ text: 'A' }, { text: 'B' }], rows: [[{ text: '1' }, { text: '2' }]] });
    const prompt = document.createElement('u-prompt') as unknown as El;
    box.append(file, table, prompt);
    document.body.appendChild(box);
    await settle(box);

    const noise = await clickableNoise(box);
    expect([...new Set(noise.map((n) => `${n.element} (${n.role}) ${n.types.join('+')}`))]).toEqual([]);
  }, 60_000);
});
