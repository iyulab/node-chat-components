import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../../src/components/blocks/UMarkedBlock.js';
import type { UMarkedBlock } from '../../src/components/blocks/UMarkedBlock.js';
import { registerElementBlock } from '../../src/utilities/ElementRegistry.js';

/**
 * `block-json` 블록을 만들지 못한 채 흐름이 끝나면(깨진 JSON · 미등록 태그 · 정의되지 않은 요소)
 * 그 자리는 비지 않고 받은 원문이 `block-json` 코드 블록으로 남는다 — 답변의 일부가 소리 없이
 * 사라지지 않는다. 흐름 중에는 종전처럼 스켈레톤이다.
 */
class FallbackProbe extends HTMLElement {
  text = '';
}
customElements.define('x-fallback-probe', FallbackProbe);
registerElementBlock({ tag: 'x-fallback-probe', properties: { text: { type: 'string' } } });
// 등록은 됐지만 정의되지 않은 요소(모듈을 싣지 않은 경우)
registerElementBlock({ tag: 'x-never-defined', properties: { text: { type: 'string' } } });

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const fence = (body: string) => '```block-json\n' + body + '\n```';

type Block = HTMLElement & { loading: boolean; updateComplete: Promise<boolean> };

async function settle(el: UMarkedBlock): Promise<Block> {
  // 스트리밍 플래그(1.5초)가 풀려 마지막 렌더가 `loading=false` 로 나간다.
  await wait(1700);
  await el.updateComplete;
  const block = el.shadowRoot!.querySelector('u-element-block') as Block;
  await block.updateComplete;
  await wait(0);
  await block.updateComplete;
  return block;
}

async function stream(full: string): Promise<UMarkedBlock> {
  const el = document.createElement('u-marked-block') as UMarkedBlock;
  document.body.appendChild(el);
  for (let i = 24; i < full.length; i += 24) {
    el.value = full.slice(0, i);
    await wait(30);
  }
  el.value = full;
  return el;
}

const codeOf = (block: Block) =>
  block.shadowRoot!.querySelector('u-code-block') as (HTMLElement & { lang: string; value?: string }) | null;

describe('u-element-block — 만들지 못한 블록은 원문으로 남는다', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it('깨진 JSON 으로 흐름이 끝나면 원문을 block-json 코드 블록으로 그린다', async () => {
    const broken = '{"tag":"x-fallback-probe","properties":{"text":"a <b> & c';
    const el = await stream('앞 문장.\n\n' + fence(broken) + '\n\n뒤 문장.');

    // 흐름 중에는 스켈레톤
    const during = el.shadowRoot!.querySelector('u-element-block') as Block;
    expect(during.loading).toBe(true);

    const block = await settle(el);
    expect(block.loading).toBe(false);
    const code = codeOf(block);
    expect(code).not.toBeNull();
    expect(code!.lang).toBe('block-json');
    // HTML 파서 회피용 이스케이프(< 등)가 아니라 받은 글자 그대로
    expect(code!.value).toBe(broken);
    expect(el.shadowRoot!.textContent).toContain('뒤 문장.');
  });

  it('깨진 원문의 문자 그대로인 \\u003c · --> 도 받은 그대로 보인다', async () => {
    const broken = '{"tag":"x-fallback-probe","properties":{"text":"\\u003c is literal, a --> b';
    const el = await stream(fence(broken));
    const block = await settle(el);
    expect(codeOf(block)?.value).toBe(broken);
  });

  it('완성된 JSON 의 --> 도 파싱된다 — HTML 파서 회피 이스케이프가 JSON 을 깨뜨리지 않는다', async () => {
    const el = await stream(fence(JSON.stringify({ tag: 'x-fallback-probe', properties: { text: 'a --> b <i>' } })));
    const block = await settle(el);
    expect((block.shadowRoot!.querySelector('x-fallback-probe') as FallbackProbe | null)?.text).toBe('a --> b <i>');
  });

  it('등록되지 않은 태그 · 정의되지 않은 요소도 원문으로 남는다', async () => {
    for (const tag of ['x-unregistered-tag', 'x-never-defined']) {
      document.body.innerHTML = '';
      const json = JSON.stringify({ tag, properties: { text: 'hi' } });
      const el = await stream(fence(json));
      const block = await settle(el);
      expect(codeOf(block)?.value, tag).toBe(json);
    }
  });

  it('만들어진 블록은 그대로 — 코드 블록을 함께 그리지 않는다', async () => {
    const el = await stream(fence(JSON.stringify({ tag: 'x-fallback-probe', properties: { text: 'ok' } })));
    const block = await settle(el);
    const probe = block.shadowRoot!.querySelector('x-fallback-probe') as FallbackProbe | null;
    expect(probe?.text).toBe('ok');
    expect(codeOf(block)).toBeNull();
  });
});
