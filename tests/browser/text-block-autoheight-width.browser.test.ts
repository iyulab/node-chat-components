import { describe, it, expect, beforeEach } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../../src/components/blocks/UTextBlock.js';
import '../../src/components/prompt/UPrompt.js';

/**
 * The editable text block grows with its content: a hidden `pre` mirrors the value and sets the height, and the
 * textarea fills that box. Both must wrap at the same width. When only the textarea showed a scrollbar (it overflows
 * for a moment when a whole sentence arrives at once), it wrapped narrower than the mirror, needed one more line than
 * the mirror measured, kept overflowing — and so kept the scrollbar. Text whose line count sits on that boundary
 * stopped one line short behind an inner scroll.
 *
 * Needs real scrollbars — the browser project launches without `--hide-scrollbars` (vitest.config.ts).
 *
 * Platform limit: macOS draws overlay scrollbars (zero layout width) unless the system setting is "always" and a mouse
 * is attached, and a headless run cannot change that — the defect cannot exist there, so on macOS an overlay-scrollbar
 * probe skips these tests by name instead of failing. Anywhere else a zero-width scrollbar still fails loudly: the
 * test would otherwise pass without being able to see anything.
 */
type Block = HTMLElement & { editable: boolean; maxRows?: number; updateComplete: Promise<unknown> };

const SENTENCE = '좁은 채팅 패널에서 긴 문장을 입력하면 자동 높이가 마지막 줄까지 보여야 하고 안쪽 스크롤이 생기면 안 됩니다';
const IS_MAC = /Mac|iPhone|iPad/.test(navigator.platform);
const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

describe('u-text-block — the textarea and its height mirror wrap at the same width', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  /** Scrollbar width the page really lays out; skips on a macOS overlay-scrollbar window, fails elsewhere (see the header). */
  function requireScrollbars(skip: (note?: string) => never): void {
    const probe = document.createElement('div');
    probe.style.cssText = 'width:100px;height:50px;overflow:scroll';
    document.body.appendChild(probe);
    const width = probe.offsetWidth - probe.clientWidth;
    probe.remove();
    if (width === 0 && IS_MAC) skip('macOS overlay scrollbars have no layout width — the defect cannot show');
    expect(width, 'scrollbars are hidden — the test cannot see the defect').toBeGreaterThan(0);
  }

  it('a sentence that arrives at once is shown whole at every width — no inner scroll below maxRows', async ({ skip }) => {
    requireScrollbars(skip);

    const stuck: string[] = [];
    // The sweep crosses widths where one line break sits within a scrollbar's width of the edge (it did at 304–312px).
    for (let width = 280; width <= 330; width += 2) {
      document.body.innerHTML = '';
      const el = document.createElement('u-text-block') as Block;
      el.style.cssText = `display:block;width:${width}px;font-size:13px;line-height:19.5px`;
      el.editable = true;
      el.maxRows = 10;
      document.body.appendChild(el);
      await el.updateComplete;
      await frame();
      const area = el.shadowRoot!.querySelector('textarea') as HTMLTextAreaElement;
      await userEvent.fill(area, SENTENCE);
      await frame();
      if (area.scrollHeight > area.clientHeight + 1) stuck.push(`${width}px: ${area.scrollHeight} > ${area.clientHeight}`);
    }
    expect(stuck).toEqual([]);
  }, 120_000);

  it('the same through u-prompt (the chat input composes the block)', async ({ skip }) => {
    requireScrollbars(skip);
    const prompt = document.createElement('u-prompt') as HTMLElement & { updateComplete: Promise<unknown> };
    prompt.style.cssText = 'display:block;width:330px;font-size:13px;line-height:19.5px';
    document.body.appendChild(prompt);
    await prompt.updateComplete;
    const block = prompt.shadowRoot!.querySelector('u-text-block') as Block;
    await block.updateComplete;
    const area = block.shadowRoot!.querySelector('textarea') as HTMLTextAreaElement;
    const stuck: string[] = [];
    for (let width = 250; width <= 420; width += 2) {
      prompt.style.width = `${width}px`;
      await userEvent.fill(area, '');
      await frame();
      await userEvent.fill(area, SENTENCE);
      await frame();
      if (area.scrollHeight > area.clientHeight + 1) stuck.push(`${width}px: ${area.scrollHeight} > ${area.clientHeight}`);
    }
    expect(stuck).toEqual([]);
  }, 120_000);
});
