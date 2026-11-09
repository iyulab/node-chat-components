import { describe, it, expect, afterEach } from 'vitest';
import '../../src/components-extra/UImagesBlock.js';
import type { UImagesBlock } from '../../src/components-extra/UImagesBlock.js';

/**
 * `u-images-block` 의 라이트박스는 `dir="rtl"` 에서 **읽는 방향**을 따른다 — 이전은 시작 쪽(오른쪽) · 다음은 끝 쪽(왼쪽),
 * 화살표 모양과 방향키도 같고, 현재 슬라이드는 트랙이 어느 방향으로 흘러도 화면 가운데에 선다.
 * 오라클은 «시작 가장자리와의 거리» · «슬라이드 가운데 − 화면 가운데» 라 방향 없이 같은 값을 단언한다.
 */

const PX = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
const ITEMS = [0, 1, 2].map((i) => ({ src: PX, alt: `image ${i}` }));

afterEach(() => { document.documentElement.dir = 'ltr'; document.body.innerHTML = ''; });

async function open(dir: 'ltr' | 'rtl', index: number): Promise<UImagesBlock> {
  document.documentElement.dir = dir;
  document.body.innerHTML = '<div style="width:500px"><u-images-block id="h"></u-images-block></div>';
  const el = document.getElementById('h') as UImagesBlock;
  el.items = ITEMS;
  await el.updateComplete;
  el.open(index);
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 450));   // 트랙 이동(--u-duration-slow) 이 끝나도록 — 슬라이드 폭의 vw 는 스크롤바를 포함한 폭이라 가운데는 innerWidth 로 잰다
  return el;
}

const q = (el: UImagesBlock, sel: string) => el.shadowRoot!.querySelector<HTMLElement>(sel)!;
/** 고정 오버레이가 덮는 보이는 영역 — 세로 스크롤바는 LTR 에서 오른쪽 · RTL 에서 왼쪽에 서서 폭을 먹는다. */
const viewport = (dir: 'ltr' | 'rtl') => {
  const bar = window.innerWidth - document.documentElement.clientWidth;
  return dir === 'rtl' ? { left: bar, right: window.innerWidth } : { left: 0, right: document.documentElement.clientWidth };
};
const startEdge = (dir: 'ltr' | 'rtl', r: DOMRect) => (dir === 'ltr' ? r.left - viewport(dir).left : viewport(dir).right - r.right);
const endEdge = (dir: 'ltr' | 'rtl', r: DOMRect) => (dir === 'ltr' ? viewport(dir).right - r.right : r.left - viewport(dir).left);

describe('RTL — 이미지 라이트박스', () => {
  it.each(['ltr', 'rtl'] as const)('%s: 이전 단추는 시작 가장자리에, 다음 단추는 끝 가장자리에 붙는다', async (dir) => {
    const el = await open(dir, 1);
    const prev = q(el, '.lb-nav.prev').getBoundingClientRect();
    const next = q(el, '.lb-nav.next').getBoundingClientRect();
    expect(Math.abs(startEdge(dir, prev)), `${dir}: 이전 단추의 시작 간격`).toBeLessThanOrEqual(1);
    expect(Math.abs(endEdge(dir, next)), `${dir}: 다음 단추의 끝 간격`).toBeLessThanOrEqual(1);
  });

  it.each(['ltr', 'rtl'] as const)('%s: 현재 슬라이드는 화면 가운데에 선다(첫 · 가운데 · 끝)', async (dir) => {
    for (const idx of [0, 1, 2]) {
      const el = await open(dir, idx);
      const slide = q(el, '.lb-slide[active]').getBoundingClientRect();
      const center = (slide.left + slide.right) / 2;
      expect(Math.abs(center - window.innerWidth / 2), `${dir} idx=${idx}: 슬라이드 가운데 ${center}`).toBeLessThanOrEqual(2);
    }
  });

  it.each(['ltr', 'rtl'] as const)('%s: 이전 단추의 화살표는 시작 쪽, 다음 단추의 화살표는 끝 쪽을 가리킨다', async (dir) => {
    const el = await open(dir, 1);
    const flipped = (sel: string) => getComputedStyle(q(el, `${sel} u-icon`)).transform.startsWith('matrix(-1');
    // chevron-left(이전) · chevron-right(다음) 는 LTR 모양이다 — RTL 에서는 둘 다 뒤집힌다.
    expect(flipped('.lb-nav.prev'), `${dir}: 이전 화살표`).toBe(dir === 'rtl');
    expect(flipped('.lb-nav.next'), `${dir}: 다음 화살표`).toBe(dir === 'rtl');
  });

  it.each([['ltr', 'ArrowLeft', 0], ['ltr', 'ArrowRight', 2], ['rtl', 'ArrowRight', 0], ['rtl', 'ArrowLeft', 2]] as const)(
    '%s: %s 는 이전/다음 — 순번 1 에서 %s 로 간다(시작 쪽 화살표가 이전)',
    async (dir, key, expected) => {
      const el = await open(dir, 1);
      document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      await el.updateComplete;
      expect((el as unknown as { index: number }).index, `${dir} ${key}`).toBe(expected);
    });
});
