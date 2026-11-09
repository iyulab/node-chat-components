import { describe, it, expect, afterEach } from 'vitest';
import '../../src/components/references/URefCardGroup.js';
import '../../src/components/references/URefCard.js';

/**
 * `u-ref-card-group` 은 `dir="rtl"` 에서 첫 카드가 시작(오른쪽)에 서고 «다음» 이 끝(왼쪽)으로 흐른다. 트랙의 `translateX` 부호가 방향을 따르지 않으면
 * RTL 에서 다음 카드가 뷰포트 밖으로 달아나 빈 칸이 보인다. 오라클은 «현재 카드가 뷰포트를 채운다» · 이전/다음 단추의 위치와 화살표 모양이다.
 */

afterEach(() => { document.documentElement.dir = 'ltr'; document.body.innerHTML = ''; });

const GROUP = `<div style="width:400px"><u-ref-card-group id="h">
  <u-ref-card id="c0" title="Zero" url="https://example.com/0"></u-ref-card>
  <u-ref-card id="c1" title="One" url="https://example.com/1"></u-ref-card>
  <u-ref-card id="c2" title="Two" url="https://example.com/2"></u-ref-card>
</u-ref-card-group></div>`;

type Group = HTMLElement & { switch(i: number): void; updateComplete: Promise<unknown> };

async function render(dir: 'ltr' | 'rtl'): Promise<Group> {
  document.documentElement.dir = dir;
  document.body.innerHTML = `<style>u-ref-card-group::part(base) * { transition: none !important; }</style>${GROUP}`;
  const g = document.getElementById('h') as Group;
  await g.updateComplete;
  await new Promise((r) => setTimeout(r, 200));
  return g;
}
const box = (el: Element) => el.getBoundingClientRect();
const viewport = (g: Group) => g.shadowRoot!.querySelector('.viewport')!;

describe('RTL — u-ref-card-group', () => {
  it.each(['ltr', 'rtl'] as const)('%s: 현재 카드는 뷰포트를 채운다(처음 · 다음 · 마지막)', async (dir) => {
    const g = await render(dir);
    for (const i of [0, 1, 2]) {
      g.switch(i);
      await g.updateComplete;
      await new Promise((r) => setTimeout(r, 400));   // 트랙 전환 시간
      const V = box(viewport(g));
      const C = box(document.getElementById(`c${i}`)!);
      expect(Math.abs(C.left - V.left), `${dir} 카드 ${i}: 뷰포트 왼쪽 ${V.left} · 카드 왼쪽 ${C.left}`).toBeLessThanOrEqual(2);
      expect(Math.abs(C.right - V.right)).toBeLessThanOrEqual(2);
    }
  });

  it.each(['ltr', 'rtl'] as const)('%s: 이전 단추는 시작 쪽에 있고 화살표는 시작 쪽을 가리킨다', async (dir) => {
    const g = await render(dir);
    const btns = Array.from(g.shadowRoot!.querySelectorAll('.nav-button'));
    const [prev, next] = btns;
    const H = box(g.shadowRoot!.querySelector('.header')!);
    const P = box(prev); const N = box(next);
    // 이전이 시작 쪽: LTR 은 왼쪽 · RTL 은 오른쪽
    expect(dir === 'ltr' ? P.left < N.left : P.left > N.left, `${dir}: 이전 단추가 시작 쪽`).toBe(true);
    expect(H.width).toBeGreaterThan(0);
    const flipped = (b: Element) => getComputedStyle(b.querySelector('u-icon')!).transform.startsWith('matrix(-1');
    expect(flipped(prev), `${dir}: 이전 화살표`).toBe(dir === 'rtl');
    expect(flipped(next), `${dir}: 다음 화살표`).toBe(dir === 'rtl');
  });
});
