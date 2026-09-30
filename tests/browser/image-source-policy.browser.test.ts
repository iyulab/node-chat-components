import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '../../src/components/blocks/UMarkedBlock.js';
import '../../src/components-extra/UImagesBlock.js';
import type { UMarkedBlock } from '../../src/components/blocks/UMarkedBlock.js';
import type { UImagesBlock } from '../../src/components-extra/UImagesBlock.js';
import { setAllowedImagePrefixes, resolveImageSource } from '../../src/utilities/imageSources.js';
import { Locale } from '@iyulab/components/dist/utilities/Locale.js';

/**
 * 모델이 쓴 이미지 URL 은 렌더되는 순간 요청된다 — 프롬프트 인젝션된 응답은 그 쿼리에 데이터를 실어
 * 제3자에게 보낼 수 있다(사용자 조작 없이). 출처 정책은 그 요청 자체를 막아야 한다:
 * `<img>` 를 만든 뒤 숨기는 것으로는 부족하다(이미 요청이 나갔다).
 */
// 같은 출처 URL — 존재하지 않아도 요청은 리소스 타이밍에 남는다(네거티브 컨트롤로 확인).
const EXFIL = `${location.origin}/__exfil.png?d=`;

function requested(url: string): boolean {
  return performance.getEntriesByType('resource').some((e) => e.name.startsWith(url));
}

async function renderMarked(value: string): Promise<UMarkedBlock> {
  const el = document.createElement('u-marked-block') as UMarkedBlock;
  el.value = value;
  document.body.appendChild(el);
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 120));
  await el.updateComplete;
  return el;
}

describe('이미지 출처 정책', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    Locale.set('en');
  });
  afterEach(() => {
    setAllowedImagePrefixes(undefined);
    Locale.set('en');
  });

  it('기본값(정책 없음)은 종전대로 전부 불러온다', async () => {
    const el = await renderMarked('![a](https://cdn.example.com/a.png)');
    expect(el.shadowRoot!.querySelector('img')?.getAttribute('src')).toBe('https://cdn.example.com/a.png');
  });

  it('허용 접두 밖의 마크다운 이미지는 요청하지 않고 대체 텍스트로 그린다', async () => {
    setAllowedImagePrefixes(['https://cdn.example.com/images/']);
    const marker = EXFIL + 'md-' + Math.random().toString(36).slice(2);
    const el = await renderMarked(`![secret](${marker}) ![ok](https://cdn.example.com/images/ok.png)`);
    const root = el.shadowRoot!;

    const imgs = [...root.querySelectorAll('img')].map((i) => i.getAttribute('src'));
    expect(imgs).toEqual(['https://cdn.example.com/images/ok.png']);
    expect(root.querySelector('.image-blocked')?.textContent).toBe('Image blocked: secret');

    await new Promise((r) => setTimeout(r, 200));
    expect(requested(marker)).toBe(false);
  });

  it('상대 경로는 document.baseURI 로 풀린 절대 URL 과 비교한다', async () => {
    setAllowedImagePrefixes([location.origin + '/']);
    expect(resolveImageSource('/local.png')).toBe('/local.png');
    expect(resolveImageSource('https://elsewhere.example/x.png')).toBeNull();
  });

  it('[] 는 전부 막고 [\'*\'] 는 전부 허용한다 — 위험 프로토콜은 어느 쪽이든 막는다', () => {
    setAllowedImagePrefixes([]);
    expect(resolveImageSource('https://cdn.example.com/a.png')).toBeNull();
    setAllowedImagePrefixes(['*']);
    expect(resolveImageSource('https://cdn.example.com/a.png')).toBe('https://cdn.example.com/a.png');
    expect(resolveImageSource('javascript:alert(1)')).toBeNull();
  });

  it('data:image 는 요청이 없으므로 정책과 무관하게 그린다 — 다른 data: 는 막는다', () => {
    const gif = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
    setAllowedImagePrefixes([]);
    expect(resolveImageSource(gif)).toBe(gif);
    expect(resolveImageSource('data:text/html,<script>alert(1)</script>')).toBeNull();
    setAllowedImagePrefixes(undefined);
    expect(resolveImageSource('data:text/html,<script>alert(1)</script>')).toBeNull();
  });

  it('표 셀 안의 이미지도 같은 정책을 탄다', async () => {
    setAllowedImagePrefixes([]);
    const el = await renderMarked(['| h |', '|---|', `| ![c](${EXFIL}cell) |`].join('\n'));
    const table = el.shadowRoot!.querySelector('u-table-block') as HTMLElement & { updateComplete: Promise<boolean> };
    expect(table).not.toBeNull();
    await table.updateComplete;
    expect(table.shadowRoot!.querySelector('td img')).toBeNull();
    expect(table.shadowRoot!.textContent).toContain('Image blocked: c');
  });

  it('차단 문구는 로케일을 따른다', async () => {
    setAllowedImagePrefixes([]);
    Locale.set('ko');
    const el = await renderMarked('![도면](https://cdn.example.com/a.png) ![](https://cdn.example.com/b.png)');
    const labels = [...el.shadowRoot!.querySelectorAll('.image-blocked')].map((s) => s.textContent);
    expect(labels).toEqual(['차단된 이미지: 도면', '차단된 이미지']);
  });

  it('u-images-block 도 막힌 이미지를 요청하지 않는다 — 썸네일과 라이트박스 모두', async () => {
    setAllowedImagePrefixes(['https://cdn.example.com/images/']);
    const marker = EXFIL + 'blk-' + Math.random().toString(36).slice(2);
    const el = document.createElement('u-images-block') as UImagesBlock;
    el.items = [
      { src: 'https://cdn.example.com/images/ok.png', alt: 'ok' },
      { src: marker, alt: 'leak' },
      { src: 'javascript:alert(1)', alt: 'js' },
    ];
    document.body.appendChild(el);
    await el.updateComplete;
    const root = el.shadowRoot!;

    const srcs = [...root.querySelectorAll('img')].map((i) => i.getAttribute('src'));
    expect(srcs).toEqual(['https://cdn.example.com/images/ok.png']);
    const blocked = [...root.querySelectorAll('.slide.blocked')].map((s) => s.textContent?.trim());
    expect(blocked).toEqual(['Image blocked: leak', 'Image blocked: js']);
    // 막힌 자리는 열 것이 없으므로 버튼이 아니다.
    expect(root.querySelectorAll('button.slide').length).toBe(1);

    (root.querySelector('button.slide') as HTMLButtonElement).click();
    await el.updateComplete;
    const lbSrcs = [...root.querySelectorAll('.lb-slide img')].map((i) => i.getAttribute('src'));
    expect(lbSrcs).toEqual(['https://cdn.example.com/images/ok.png']);
    expect(root.querySelectorAll('.lb-blocked').length).toBe(2);

    await new Promise((r) => setTimeout(r, 200));
    expect(requested(marker)).toBe(false);
  });
});
