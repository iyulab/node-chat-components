import { describe, it, expect, afterEach } from 'vitest';
import '../../src/components/references/URefCard.js';
import '../../src/components/blocks/URefBlock.js';
import '../../src/components/blocks/UMarkedBlock.js';
import type { URefCard } from '../../src/components/references/URefCard.js';
import type { URefBlock } from '../../src/components/blocks/URefBlock.js';
import type { UMarkedBlock } from '../../src/components/blocks/UMarkedBlock.js';
import type { ReferenceSource } from '../../src/types/References.js';
import { setAllowedImagePrefixes } from '../../src/utilities/imageSources.js';

/**
 * 인용 출처의 미리보기 이미지(`ReferenceSource.image`).
 *
 * 근거가 시각 자료(문서에서 뽑은 도표·그림, 문서 쪽 축소판, 웹 문서의 대표 이미지)인 인용을 카드가 보이지 못해, 소비앱이
 * 인용 UI 밖에 썸네일 컴포넌트를 따로 그렸다. 미리보기는 모델 출력의 이미지와 같은 출처 정책을 거친다 — 요청이 곧 반출
 * 경로이기 때문이다.
 */
const FIGURE: ReferenceSource = {
  type: 'document',
  title: 'Quarterly report',
  snippet: 'Revenue by region',
  image: { src: 'https://cdn.example.com/images/fig-3.png', alt: 'Bar chart of revenue by region' },
};

afterEach(() => {
  setAllowedImagePrefixes(undefined);
  document.body.innerHTML = '';
});

async function card(source: ReferenceSource): Promise<URefCard> {
  const el = document.createElement('u-ref-card') as URefCard;
  Object.assign(el, { type: source.type, title: source.title, snippet: source.snippet, image: source.image });
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('u-ref-card 미리보기 이미지', () => {
  it('🔴출처 이미지를 대체 텍스트와 함께 본문 위에 그린다', async () => {
    const el = await card(FIGURE);
    const img = el.shadowRoot!.querySelector<HTMLImageElement>('img.preview')!;
    expect(img.getAttribute('src')).toBe('https://cdn.example.com/images/fig-3.png');
    expect(img.alt).toBe('Bar chart of revenue by region');
    expect(img.compareDocumentPosition(el.shadowRoot!.querySelector('.body')!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('🔴출처 정책이 막으면 요청하지 않고 «차단된 이미지» 로 대체 텍스트를 보인다', async () => {
    setAllowedImagePrefixes([location.origin + '/']);
    const el = await card(FIGURE);
    expect(el.shadowRoot!.querySelector('img.preview')).toBeNull();
    expect(el.shadowRoot!.querySelector('.preview-blocked')!.textContent).toContain('Bar chart of revenue by region');
  });

  it('🔴위험한 프로토콜은 정책과 무관하게 막힌다', async () => {
    const el = await card({ ...FIGURE, image: { src: 'javascript:alert(1)' } });
    expect(el.shadowRoot!.querySelector('img.preview')).toBeNull();
    expect(el.shadowRoot!.querySelector('.preview-blocked')).not.toBeNull();
  });

  it('NEGATIVE 이미지가 없으면 미리보기 자리가 없다', async () => {
    const el = await card({ type: 'web', title: 'Page', url: 'https://example.com/' });
    expect(el.shadowRoot!.querySelector('.preview, .preview-blocked')).toBeNull();
  });

  it('🔴u-ref-block 이 출처의 이미지를 카드로 넘긴다', async () => {
    const block = document.createElement('u-ref-block') as URefBlock;
    block.sources = [FIGURE];
    document.body.appendChild(block);
    await block.updateComplete;
    const refCard = block.shadowRoot!.querySelector('u-ref-card') as URefCard;
    await refCard.updateComplete;
    expect(refCard.shadowRoot!.querySelector('img.preview')).not.toBeNull();
  });

  it('🔴본문 인용(u-marked-block refs)의 툴팁 카드도 이미지를 그린다', async () => {
    const md = document.createElement('u-marked-block') as UMarkedBlock;
    md.value = 'Revenue grew in the north.';
    md.refs = [{ startIndex: 0, endIndex: 26, label: '[1]', sources: [FIGURE] }];
    document.body.appendChild(md);
    await md.updateComplete;
    await new Promise((r) => setTimeout(r, 150));
    await md.updateComplete;
    const tooltipCard = md.shadowRoot!.querySelector('u-ref-card') as URefCard;
    await tooltipCard.updateComplete;
    await new Promise((r) => setTimeout(r, 50));
    expect(tooltipCard.shadowRoot!.querySelector('img.preview')?.getAttribute('alt')).toBe('Bar chart of revenue by region');
  });
});
