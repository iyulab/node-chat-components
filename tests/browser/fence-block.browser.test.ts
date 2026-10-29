import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../../src/components/blocks/UMarkedBlock.js';
import type { UMarkedBlock } from '../../src/components/blocks/UMarkedBlock.js';
import { registerFenceBlock, getElementBlockProperties, registerElementBlock } from '../../src/utilities/ElementRegistry.js';
import { ElementPromptBuilder } from '../../src/utilities/PromptBuilder.js';

/**
 * 본문 자체가 텍스트 하나인 블록(다이어그램 DSL · 수식 등)은 등록된 펜스 언어로 쓴다 — 그 텍스트를
 * `block-json` 의 JSON 문자열 안에 넣어 줄바꿈 · 따옴표를 이스케이프하지 않아도 된다.
 * 허용 목록 의미는 같다: 등록된 언어만 블록이 되고, 대입하는 것은 등록한 속성 하나뿐이다.
 */
class DiagramProbe extends HTMLElement {
  spec: unknown = undefined;
  secret = 'untouched';
}
customElements.define('x-diagram-probe', DiagramProbe);
class JsonProbe extends HTMLElement {
  config: unknown = undefined;
}
customElements.define('x-json-probe', JsonProbe);

registerFenceBlock({ lang: 'diagram', tag: 'x-diagram-probe', property: 'spec' });
registerFenceBlock({ lang: 'probe-json', tag: 'x-json-probe', property: 'config', as: 'json' });

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
type Block = HTMLElement & { updateComplete: Promise<boolean> };

async function render(value: string): Promise<UMarkedBlock> {
  const el = document.createElement('u-marked-block') as UMarkedBlock;
  el.value = value;
  document.body.appendChild(el);
  await el.updateComplete;
  await wait(1700); // 스트리밍 플래그가 풀려 loading=false 로 다시 그린다
  await el.updateComplete;
  for (const b of el.shadowRoot!.querySelectorAll<Block>('u-element-block')) {
    await b.updateComplete;
    await wait(0);
    await b.updateComplete;
  }
  return el;
}

const child = <T extends Element>(el: UMarkedBlock, tag: string) =>
  el.shadowRoot!.querySelector('u-element-block')?.shadowRoot?.querySelector(tag) as T | null;

describe('펜스 블록 — 등록된 펜스 언어 → 블록 속성 하나', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it('본문을 이스케이프 없이 그대로 지정한 속성에 대입한다 — 따옴표 · 꺾쇠 · 줄바꿈 포함', async () => {
    const spec = 'kind = "flow"\n\n[[items]]\nlabel = "a <b> & c"\n';
    const el = await render('앞\n\n```diagram\n' + spec + '```\n\n뒤');
    const probe = child<DiagramProbe>(el, 'x-diagram-probe');
    expect(probe).not.toBeNull();
    // 펜스 본문 — 닫는 펜스 앞의 마지막 줄바꿈은 마크다운이 본문에 넣지 않는다
    expect(probe!.spec).toBe(spec.slice(0, -1));
    expect(probe!.secret).toBe('untouched');
    expect(el.shadowRoot!.querySelector('u-code-block')).toBeNull();
  });

  it('as: json 이면 파싱한 값을 대입한다', async () => {
    const el = await render('```probe-json\n{"a": [1, 2], "b": "x"}\n```');
    expect(child<JsonProbe>(el, 'x-json-probe')?.config).toEqual({ a: [1, 2], b: 'x' });
  });

  it('as: json 의 깨진 본문은 흐름이 끝난 뒤 그 언어의 코드 블록으로 남는다', async () => {
    const el = await render('```probe-json\n{"a": [1,\n```');
    const code = child<HTMLElement & { lang: string; value?: string }>(el, 'u-code-block');
    expect(code?.lang).toBe('probe-json');
    expect(code?.value).toBe('{"a": [1,');
  });

  it('등록되지 않은 언어는 종전대로 코드 블록이다 — 블록이 되지 않는다', async () => {
    const el = await render('```mermaid\ngraph TD; A-->B\n```');
    expect(el.shadowRoot!.querySelector('u-element-block')).toBeNull();
    expect(el.shadowRoot!.querySelector('u-code-block')).not.toBeNull();
  });

  it('펜스 등록은 그 태그의 허용 목록에 속성 하나를 더하고, 뒤의 스키마 등록이 그것을 지우지 않는다', () => {
    expect(getElementBlockProperties('x-diagram-probe')?.has('spec')).toBe(true);
    registerElementBlock({ tag: 'x-diagram-probe', properties: { title: { type: 'string' } } });
    const allowed = getElementBlockProperties('x-diagram-probe')!;
    expect([...allowed].sort()).toEqual(['spec', 'title']);
  });

  it('block-json 은 펜스 언어로 등록할 수 없다', () => {
    expect(() => registerFenceBlock({ lang: 'block-json', tag: 'x-diagram-probe', property: 'spec' })).toThrow();
  });

  it('프롬프트가 펜스 블록을 그 언어로 쓰라고 알린다', () => {
    const builder = new (ElementPromptBuilder as unknown as { new (): ElementPromptBuilder })();
    builder.addFence({
      lang: 'Chart-DSL', tag: 'x-diagram-probe', property: 'spec',
      description: 'Draws a diagram.', example: 'kind = "flow"',
    });
    const prompt = builder.build();
    expect(prompt).toContain('### `chart-dsl` fence');
    expect(prompt).toContain('Draws a diagram.');
    expect(prompt).toContain('```chart-dsl\nkind = "flow"\n```');
    expect(prompt).toContain('do not wrap it in `block-json`');
    expect(() => builder.addFence({ lang: 'chart-dsl', tag: 'x', property: 'p' })).toThrow();
  });
});
