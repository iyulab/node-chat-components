import { describe, it, expect, beforeEach } from 'vitest';
import '../../src/components/blocks/UMarkedBlock.js';
import '../../src/components-extra/UMapBlock.js';
import { registerElementBlock, getElementBlockProperties } from '../../src/utilities/ElementRegistry.js';
import { ElementPromptBuilder } from '../../src/utilities/PromptBuilder.js';

/**
 * `block-json` 은 LLM 출력이라 신뢰할 수 없다. 그래서 만들 수 있는 태그는 블록으로 등록된 것뿐이고,
 * 대입하는 속성은 그 스키마의 `properties` 에 적힌 이름뿐이다.
 *
 * 종전에는 «정의된 커스텀 엘리먼트면 무엇이든 + 거부 목록 6개 밖의 속성 전부» 였다. 그러면
 * `block-json` 이 신뢰된 HTML 을 받는 `u-table-block` 을 만들어 머리글에 `<img onerror>` 를 넣을 수 있었고,
 * 스크립트가 실행됐다.
 */
class ProbeBlock extends HTMLElement {
  text = '';
  secret = 'untouched';
}
customElements.define('x-probe-block', ProbeBlock);
registerElementBlock({ tag: 'x-probe-block', properties: { text: { type: 'string' } } });

const fence = (o: object) => '```block-json\n' + JSON.stringify(o) + '\n```';

async function render(value: string): Promise<HTMLElement> {
  const el = document.createElement('u-marked-block') as HTMLElement & { value: string; updateComplete: Promise<boolean> };
  el.value = value;
  document.body.appendChild(el);
  await el.updateComplete;
  // 스트리밍 플래그(1.5초)가 풀려야 블록이 로딩 스켈레톤이 아니라 실제 엘리먼트로 그려진다.
  await new Promise((r) => setTimeout(r, 1700));
  await el.updateComplete;
  const block = el.shadowRoot!.querySelector('u-element-block') as HTMLElement & { updateComplete: Promise<boolean> } | null;
  await block?.updateComplete;
  return el;
}

const blockChild = (el: HTMLElement, tag: string) =>
  el.shadowRoot!.querySelector('u-element-block')?.shadowRoot?.querySelector(tag) as HTMLElement | null;

describe('block-json 허용 목록', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    (window as unknown as { __pwned: number }).__pwned = 0;
  });

  it('블록으로 등록되지 않은 태그는 정의돼 있어도 만들지 않는다 — 신뢰 HTML 속성으로 스크립트가 실행되지 않는다', async () => {
    expect(customElements.get('u-table-block')).toBeDefined();
    const el = await render(fence({
      tag: 'u-table-block',
      properties: { headers: [{ text: '<img src=x onerror="window.__pwned=1">', align: null }], rows: [] },
    }));
    await new Promise((r) => setTimeout(r, 300)); // img 로드 실패 → onerror 가 발화할 시간

    expect(blockChild(el, 'u-table-block')).toBeNull();
    expect((window as unknown as { __pwned: number }).__pwned).toBe(0);
  });

  it('등록된 블록에는 스키마의 속성만 대입하고 그 밖의 이름(style 등)은 버린다', async () => {
    const el = await render(fence({
      tag: 'u-map-block',
      properties: { lat: 37.5, lng: 127, label: 'Seoul', style: 'position:fixed;inset:0' },
    }));
    const map = blockChild(el, 'u-map-block') as HTMLElement & { label?: string };

    expect(map).not.toBeNull();
    expect(map.label).toBe('Seoul');
    expect(map.getAttribute('style')).toBeNull();
  });

  it('소비자가 등록한 블록도 같은 규칙을 따른다', async () => {
    const el = await render(fence({ tag: 'x-probe-block', properties: { text: 'hello', secret: 'overwritten' } }));
    const probe = blockChild(el, 'x-probe-block') as ProbeBlock;

    expect(probe).not.toBeNull();
    expect(probe.text).toBe('hello');
    expect(probe.secret).toBe('untouched');
  });

  it('ElementPromptBuilder.add 로 LLM 에게 알린 스키마는 블록으로도 등록된다', () => {
    new ElementPromptBuilder().add({
      tag: 'x-probe-prompt',
      description: 'probe',
      properties: { a: { type: 'string' } },
    });
    expect([...(getElementBlockProperties('x-probe-prompt') ?? [])]).toEqual(['a']);
  });
});

describe('extra 서브패스', () => {
  it('내장 넷을 공유 인스턴스에 등록한다 — 소비자가 더한 뒤 build() 하면 함께 나온다', async () => {
    await import('../../src/extra.js');
    const built = ElementPromptBuilder.instance.build();
    for (const tag of ['u-images-block', 'u-video-block', 'u-map-block', 'u-chart-block']) {
      expect(built).toContain(tag);
    }
  });
});
