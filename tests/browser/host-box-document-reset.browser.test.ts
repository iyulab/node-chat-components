import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import '../../src/index.js';
import '../../src/extra.js';

/**
 * Block and card boxes survive a document-wide reset (Tailwind preflight: `* { margin: 0; padding: 0; border: 0 solid }`).
 * A normal declaration in the document beats the shadow root's `:host` rule, so a box drawn on the host lost its
 * border, padding and the spacing between blocks; the box is now the shadow's `base`, which the reset cannot reach.
 */
const RESET = ':root { --u-border-color: #E0E0E0; } *, ::before, ::after { margin: 0; padding: 0; border: 0 solid; }';
let style: HTMLStyleElement;
beforeAll(() => {
  style = document.createElement('style');
  style.textContent = RESET;
  document.head.appendChild(style);
});
afterAll(() => style.remove());

async function base(html: string): Promise<CSSStyleDeclaration> {
  document.body.innerHTML = html;
  const host = document.body.firstElementChild as HTMLElement & { updateComplete?: Promise<unknown> };
  await host.updateComplete;
  await new Promise((r) => setTimeout(r, 30));
  const box = host.shadowRoot!.querySelector('.base') as HTMLElement;
  expect(box, `${host.localName} base`).toBeTruthy();
  return getComputedStyle(box);
}

describe('chat-components — boxes under a document reset', () => {
  it('u-code-block keeps its border and padding', async () => {
    const s = await base('<u-code-block lang="js" value="let a = 1"></u-code-block>');
    expect(s.borderTopWidth).toBe('1px');
    expect(s.paddingTop).toBe('8px');
  });

  it('u-prompt keeps its border and padding', async () => {
    const s = await base('<u-prompt></u-prompt>');
    expect(s.borderTopWidth).toBe('1px');
    expect(s.paddingTop).toBe('12px');
  });

  it('u-ref-card and u-ref-tag keep their borders', async () => {
    expect((await base('<u-ref-card url="https://example.com" title="Example"></u-ref-card>')).borderTopWidth).toBe('1px');
    const tag = await base('<u-ref-tag href="https://example.com">1</u-ref-tag>');
    expect(tag.borderTopWidth).toBe('1px');
    expect(tag.paddingLeft).toBe('6px');
  });

  it('u-table-block keeps its border and the space between blocks', async () => {
    document.body.innerHTML = '';
    const el = document.createElement('u-table-block') as HTMLElement & { headers: unknown; rows: unknown; updateComplete: Promise<unknown> };
    el.headers = [{ text: 'A' }];
    el.rows = [[{ text: '1' }]];
    document.body.appendChild(el);
    await el.updateComplete;
    const s = getComputedStyle(el.shadowRoot!.querySelector('.base') as HTMLElement);
    expect(s.borderTopWidth).toBe('1px');
    expect(s.marginTop).toBe('8px');
  });
});
