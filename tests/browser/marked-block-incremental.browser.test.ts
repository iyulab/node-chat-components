import { describe, it, expect, beforeEach } from 'vitest';
import '../../src/components/blocks/UMarkedBlock.js';
import type { UMarkedBlock } from '../../src/components/blocks/UMarkedBlock.js';
import { stripZeroWidth } from '../../src/utilities/sanitizers.js';

/**
 * 스트리밍 증분 렌더 — 응답이 자라는 동안 **이미 확정된 앞 블록은 그대로** 있어야 한다.
 *
 * | 계약 | 재는 것 |
 * |---|---|
 * | 노드 유지 | 뒤에 글이 붙어도 앞 문단 · 코드 블록 · 표가 같은 노드다 |
 * | 선택 유지 | 앞 문단에서 잡은 글자 선택이 뒤에 글이 붙어도 풀리지 않는다(복사하려던 문장이 사라지지 않는다) |
 * | 포커스 유지 | 앞 코드 블록의 복사 단추에 있던 포커스가 갱신으로 `body` 로 떨어지지 않는다 |
 * | 같은 화면 | 블록별 렌더의 결과가 통째로 렌더한 것과 같다(이음이 새 마크업을 만들지 않는다) |
 *
 * ## 왜 브라우저인가
 *
 * 노드 동일성 · 선택 · 포커스는 실제 DOM 의 일이다. jsdom 은 섀도 안의 선택을 모형으로만 갖는다.
 */

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function mount(): UMarkedBlock {
  const el = document.createElement('u-marked-block') as UMarkedBlock;
  document.body.appendChild(el);
  return el;
}

/** 갱신은 80ms 로 묶이므로 그보다 길게 기다린다. */
async function settle(el: UMarkedBlock) {
  await wait(300);
  await el.updateComplete;
}

beforeEach(() => { document.body.innerHTML = ''; });

describe('u-marked-block — 스트리밍 증분 렌더', () => {
  it('뒤에 글이 붙어도 앞 문단 · 코드 블록 · 표는 같은 노드이고 문단의 선택이 풀리지 않는다', async () => {
    const el = mount();
    el.value = [
      'First paragraph stays put.', '',
      '```ts', 'const a = 1;', '```', '',
      '| a | b |', '|---|---|', '| 1 | 2 |', '',
      'Last',
    ].join('\n');
    await settle(el);
    const root = el.shadowRoot!;
    const p = root.querySelector('p')!;
    const code = root.querySelector('u-code-block');
    const table = root.querySelector('u-table-block');
    expect(code).toBeTruthy();
    expect(table).toBeTruthy();
    const selection = window.getSelection()!;
    selection.setBaseAndExtent(p.firstChild!, 0, p.firstChild!, 5);
    expect(selection.toString()).toBe('First');

    el.value += ' paragraph grows';
    await settle(el);

    expect(root.querySelector('p')).toBe(p);
    expect(root.querySelector('u-code-block')).toBe(code);
    expect(root.querySelector('u-table-block')).toBe(table);
    expect(window.getSelection()!.toString()).toBe('First');
    expect(root.textContent).toContain('Last paragraph grows');
  });

  it('앞 코드 블록의 복사 단추에 있던 포커스가 뒤에 글이 붙어도 유지된다', async () => {
    const el = mount();
    el.value = ['```ts', 'const a = 1;', '```', '', 'After'].join('\n');
    await settle(el);
    const code = el.shadowRoot!.querySelector('u-code-block') as HTMLElement;
    const copy = code.shadowRoot!.querySelector('u-copy-button') as HTMLElement;
    copy.focus();
    expect(code.shadowRoot!.activeElement ?? el.shadowRoot!.activeElement).toBeTruthy();

    el.value += ' and more';
    await settle(el);

    expect(el.shadowRoot!.querySelector('u-code-block')).toBe(code);
    expect(code.shadowRoot!.activeElement).toBe(copy);
  });

  it('자라는 마지막 블록만 새로 그려진다 — 바로 앞 블록은 그대로다', async () => {
    const el = mount();
    el.value = 'One\n\nTwo';
    await settle(el);
    const [first, second] = [...el.shadowRoot!.querySelectorAll('p')];
    el.value = 'One\n\nTwo three';
    await settle(el);
    const [first2, second2] = [...el.shadowRoot!.querySelectorAll('p')];
    expect(first2).toBe(first);
    expect(second2).not.toBe(second);
    expect(second2.textContent).toBe('Two three');
  });
});

/** 통째로 렌더한 결과 — 증분 이전의 경로. */
function wholeRender(el: UMarkedBlock, value: string): string {
  const any = el as unknown as {
    parser: { parse(src: string, o: { async: false }): string };
    placeholder: { reset(): void; restore(html: string): string };
    refs?: unknown[];
    insertRefs(v: string, refs: unknown[]): string;
  };
  any.placeholder.reset();
  let v = stripZeroWidth(value);
  if (any.refs?.length) v = any.insertRefs(v, any.refs);
  return any.placeholder.restore(any.parser.parse(v, { async: false }));
}

/** 문서에 붙여 컴포넌트를 올린 뒤의 마크업 — 표 블록이 자식 JSON 을 소비하는 것까지 같은 조건으로 견준다. */
async function settled(html: string): Promise<string> {
  const div = document.createElement('div');
  document.body.appendChild(div);
  div.innerHTML = html;
  await wait(100);
  const out = div.innerHTML;
  div.remove();
  return out;
}

describe('u-marked-block — 블록별 렌더 = 통째 렌더', () => {
  const corpus: Record<string, string> = {
    headings: '# One\n\nText under.\n\n## Two\n\nSetext\n======\n\nbody',
    lists: '- a\n- b\n  - nested\n\n1. x\n2. y\n\n- [ ] todo\n- [x] done\n\n- loose\n\n- items',
    table: '| h1 | h2 |\n|----|----|\n| a | b |\n| c | d |\n\nafter',
    code: '```ts\nconst x = 1;\n```\n\n    indented code\n\n`inline` text',
    quote: '> quoted\n> more\n\n> second\n\n---\n\nrule above',
    links: 'See [ref][r] and [direct](https://example.com "t") and <https://auto.example>.\n\n[r]: https://ref.example',
    html: 'Text <b>bold</b> and <script>alert(1)</script>\n\n<div onclick="x()">block</div>\n\nend',
    math: 'Inline $a^2$ and\n\n$$\nx = 1\n$$\n\ndone',
    unterminated: 'Intro\n\n```ts\nconst partial = ',
    emphasis: 'one **bold** two *it* ~~gone~~ 10~20 range\n\nline\nbreak',
  };

  it('같은 마크업을 낸다 — 인용(refs)이 두 블록에 걸쳐 있어도', async () => {
    const el = mount();
    const value = 'Alpha beta.\n\nGamma **delta** epsilon.';
    el.refs = [
      { label: '[1]', startIndex: 5, endIndex: 5, sources: [{ type: 'web', title: 'Doc', url: 'https://example.com/doc' }] },
      { label: '[2]', startIndex: 22, endIndex: 22, sources: [{ type: 'web', title: 'Other', url: 'https://example.com/other' }] },
    ] as unknown as UMarkedBlock['refs'];
    el.value = value;
    await settle(el);
    const rendered = el.shadowRoot!.innerHTML.replace(/<!--[\s\S]*?-->/g, '');
    expect(el.shadowRoot!.querySelectorAll('u-ref-tag').length).toBe(2);
    expect(await settled(rendered)).toBe(await settled(wholeRender(el, value)));
  });

  for (const [name, value] of Object.entries(corpus)) {
    it(`같은 마크업을 낸다 — ${name}`, async () => {
      const el = mount();
      el.value = value;
      await settle(el);
      const rendered = el.shadowRoot!.innerHTML.replace(/<!--[\s\S]*?-->/g, '');
      expect(await settled(rendered)).toBe(await settled(wholeRender(el, value)));
    });
  }
});
