import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '../../src/components/references/URefCard.js';
import '../../src/components/blocks/URefBlock.js';
import type { URefCard } from '../../src/components/references/URefCard.js';

// connectedCallback의 queueMicrotask(load()) 및 비동기 error() 경로가
// 모두 소진되도록 macrotask 한 번을 기다린다.
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('URefCard 데이터 로딩', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error');
  });

  afterEach(() => {
    errorSpy.mockRestore();
    document.body.innerHTML = '';
  });

  it('property 바인딩만으로 렌더 시 console.error를 발화하지 않는다', async () => {
    // URefBlock이 카드를 구동하는 방식과 동일: script 자식 없이 property만 주입
    const el = document.createElement('u-ref-card') as URefCard;
    el.type = 'web';
    el.url = 'https://example.com/doc';
    el.title = 'Example Title';
    el.snippet = 'snippet text';
    document.body.appendChild(el);

    await el.updateComplete;
    await flush();

    expect(errorSpy).not.toHaveBeenCalled();
    expect(el.shadowRoot?.textContent).toContain('Example Title');
  });

  it('script-payload 자식이 있으면 JSON 데이터를 property에 할당한다', async () => {
    // UMarkedBlock 툴팁 경로(URefCard.buildHTML)와 동일한 script 주입 패턴
    const el = document.createElement('u-ref-card') as URefCard;
    el.innerHTML =
      '<script type="application/json">{"title":"From Script","url":"https://example.com/s"}</script>';
    document.body.appendChild(el);

    await el.updateComplete;
    await flush();
    await el.updateComplete;

    expect(errorSpy).not.toHaveBeenCalled();
    expect(el.title).toBe('From Script');
    expect(el.url).toBe('https://example.com/s');
    // 로딩 후 script 태그는 제거된다
    expect(el.querySelector('script')).toBeNull();
  });

  it('u-ref-block이 sources로 카드를 렌더해도 console.error를 발화하지 않는다', async () => {
    const block = document.createElement('u-ref-block');
    block.sources = [
      { type: 'web', url: 'https://example.com/a', title: 'Source A', snippet: 'a' },
      { type: 'document', url: 'https://example.com/b', title: 'Source B', snippet: 'b' },
    ];
    document.body.appendChild(block);

    await block.updateComplete;
    await flush();

    const cards = block.shadowRoot?.querySelectorAll('u-ref-card') ?? [];
    expect(cards.length).toBe(2);
    await Promise.all([...cards].map((card) => card.updateComplete));
    await flush();

    expect(errorSpy).not.toHaveBeenCalled();
    expect(cards[0].shadowRoot?.textContent).toContain('Source A');
    expect(cards[1].shadowRoot?.textContent).toContain('Source B');
  });
});
