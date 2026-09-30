import { describe, it, expect, beforeEach } from 'vitest';
import '../../src/components/blocks/UMarkedBlock.js';
import '../../src/components-extra/UMapBlock.js';
import type { UMarkedBlock } from '../../src/components/blocks/UMarkedBlock.js';
import type { ReferenceCitation } from '../../src/types/References.js';

type TableBlock = HTMLElement & { headers: unknown[]; rows: unknown[]; updateComplete: Promise<boolean> };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('u-marked-block — 흐름 중간의 상태', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('표 셀 안에 인용이 있어도 표 데이터가 온전히 읽힌다', async () => {
    const value = '앞 문장\n\n| 도시 | 인구 |\n|---|---|\n| 서울 | 950만 |\n| 부산 | 330만 |\n\n뒷 문장';
    const at = value.indexOf('950만') + 3;
    const refs: ReferenceCitation[] = [{
      label: '[1]', startIndex: at, endIndex: at,
      sources: [{ type: 'document', title: 'doc.pdf', snippet: 'x "q" y', url: '/x' }],
    } as ReferenceCitation];

    const el = document.createElement('u-marked-block') as UMarkedBlock;
    el.value = value;
    el.refs = refs;
    document.body.appendChild(el);
    await wait(400);

    const table = el.shadowRoot!.querySelector('u-table-block') as TableBlock;
    await table.updateComplete;
    expect(table.headers.length).toBe(2);
    expect(table.rows.length).toBe(2);
    // 인용 태그가 셀 안에 그려진다.
    expect(table.shadowRoot!.querySelector('td u-ref-tag')).not.toBeNull();
  });

  it('렌더 대기 중 떨어졌다 다시 붙어도 이후 값으로 갱신된다', async () => {
    const el = document.createElement('u-marked-block') as UMarkedBlock;
    el.value = 'first';
    document.body.appendChild(el);
    await wait(300);

    el.value = 'second';          // 80ms 렌더 대기에 들어간다
    await el.updateComplete;
    el.remove();                  // 대기 중에 떨어진다
    document.body.appendChild(el);
    el.value = 'final text';
    await wait(300);
    await el.updateComplete;

    expect(el.shadowRoot!.textContent).toContain('final text');
  });

  it('스트리밍 중 떨어졌다 다시 붙으면 block-json 이 스켈레톤에 남지 않는다', async () => {
    const el = document.createElement('u-marked-block') as UMarkedBlock;
    el.value = '```block-json\n' + JSON.stringify({ tag: 'u-map-block', properties: { lat: 37.5, lng: 127 } }) + '\n```';
    document.body.appendChild(el);
    await wait(200);              // 스트리밍 플래그(1.5초) 안
    el.remove();
    document.body.appendChild(el);
    await wait(300);
    await el.updateComplete;

    const block = el.shadowRoot!.querySelector('u-element-block') as HTMLElement & { updateComplete: Promise<boolean> };
    await block.updateComplete;
    expect(block.hasAttribute('loading')).toBe(false);
    expect(block.shadowRoot!.querySelector('u-map-block')).not.toBeNull();
  });
});
