import { describe, it, expect, afterEach } from 'vitest';
import '../../src/index.js';

/**
 * Code reads left to right whatever the page's direction is. In a right-to-left page a code line took the page as its
 * paragraph direction, so its closing punctuation jumped to the far end of the line (`foo(bar);` drew as `;)foo(bar`).
 * A code block and an inline code span are isolated and laid out left to right.
 *
 * Oracle: the screen x of every character of the code, taken in source order, must grow from left to right.
 */
const CODE = 'foo(bar);';
let host: HTMLElement;
afterEach(() => host?.remove());

/** Every text node under `root`, looking through open shadow roots. */
function deepText(root: Node, out: Text[] = []): Text[] {
  if (root.nodeType === Node.TEXT_NODE) { out.push(root as Text); return out; }
  const el = root as Element;
  if (el.shadowRoot) for (const c of Array.from(el.shadowRoot.childNodes)) deepText(c, out);
  for (const c of Array.from(root.childNodes)) deepText(c, out);
  return out;
}

function xs(node: Text): number[] {
  const range = document.createRange();
  const out: number[] = [];
  for (let i = 0; i < node.data.length; i++) {
    range.setStart(node, i);
    range.setEnd(node, i + 1);
    out.push(range.getBoundingClientRect().left);
  }
  return out;
}

async function mount(dir: 'ltr' | 'rtl', markup: string): Promise<HTMLElement> {
  host = document.createElement('div');
  host.setAttribute('dir', dir);
  host.style.cssText = 'width:400px;padding:8px';
  host.innerHTML = markup;
  document.body.appendChild(host);
  const el = host.firstElementChild as HTMLElement & { updateComplete?: Promise<unknown> };
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 200));
  return el;
}

/** The text node whose text holds the whole code line (the highlighter may split it, so join the pieces of its line). */
function lineNodes(root: Node): Text[] {
  return deepText(root).filter((t) => t.data.trim().length > 0);
}

function leftToRight(nodes: Text[]): boolean {
  const all = nodes.flatMap((n) => xs(n));
  return all.every((x, i) => i === 0 || x > all[i - 1]);
}

describe('chat-components — code keeps its own left-to-right order in a right-to-left page', () => {
  for (const dir of ['rtl', 'ltr'] as const) {
    it(`${dir}: u-code-block draws \`${CODE}\` left to right`, async () => {
      const el = await mount(dir, `<u-code-block lang="javascript">${CODE}</u-code-block>`);
      const pre = el.shadowRoot!.querySelector('pre')!;
      expect(leftToRight(lineNodes(pre))).toBe(true);
    });

    it(`${dir}: an inline code span in u-marked-block draws \`${CODE}\` left to right`, async () => {
      const el = await mount(dir, '<u-marked-block></u-marked-block>');
      // Arabic words around the span: a neutral next to a right-to-left letter takes the paragraph direction, which is the case that broke.
      (el as HTMLElement & { value: string }).value = `نص \`${CODE}\` نص`;
      await new Promise((r) => setTimeout(r, 400));
      const code = deepText(el).filter((t) => t.data.includes(CODE));
      expect(code.length).toBeGreaterThan(0);
      expect(leftToRight(code)).toBe(true);
    });
  }
});
