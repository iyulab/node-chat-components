import { describe, it, expect, afterEach } from 'vitest';
import '../../src/components/blocks/UFileBlock.js';

/**
 * A file card shows the whole file name.
 *
 * Defect: the name was one line with `text-overflow: ellipsis` inside a card of at most 200px, so a long name
 * («quarterly-reconciliation-report-final-v3.xlsx») lost its tail and, for anything but an image or a video, could not
 * be read anywhere. The name now wraps, breaking inside a long word when it has to.
 */
afterEach(() => document.body.replaceChildren());

describe('u-file-block — name', () => {
  it('wraps a long name instead of cutting it', async () => {
    const el = document.createElement('u-file-block') as HTMLElement & {
      name: string; type: string; size: number; updateComplete: Promise<boolean>;
    };
    Object.assign(el, { name: 'quarterly-reconciliation-report-final-v3.xlsx', type: 'application/vnd.ms-excel', size: 20480 });
    document.body.appendChild(el);
    await el.updateComplete;
    const name = el.shadowRoot!.querySelector<HTMLElement>('.name')!;
    const cs = getComputedStyle(name);
    expect(cs.textOverflow).not.toBe('ellipsis');
    expect(name.scrollWidth).toBeLessThanOrEqual(name.clientWidth + 1);
    // line-height is 'normal' here, so compare with the font size: two lines of text.
    expect(name.getBoundingClientRect().height).toBeGreaterThan(parseFloat(cs.fontSize) * 1.8);
  });
});
