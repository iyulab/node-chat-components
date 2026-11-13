import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../../src/components-extra/UChartBlock.js';
import type { UChartBlock } from '../../src/components-extra/UChartBlock.js';

/**
 * **`u-chart-block` 은 소비자의 개발 콘솔에 Lit «갱신 뒤 갱신» 경고를 남기지 않는다.**
 *
 * `updated()` 가 차트를 만들면서(`createChart`) 실패 문구(`error`)를 반응형 상태로 쓴다. 정상 경로(그리기 · 데이터 바꾸기)에서 그 쓰기가
 * 갱신을 한 번 더 예약하는지는 값이 실제로 바뀌는지에 달려 있어 소스만으로는 모른다. 브라우저 시험의 `console.warn` 은 러너 출력에 오지 않는다 —
 * 스파이로 직접 단언한다. Lit 은 같은 글을 페이지당 한 번만 내므로 시험마다 `globalThis.litIssuedWarnings` 를 비운다.
 */
let wrap: HTMLDivElement;
beforeEach(() => {
  (globalThis as unknown as { litIssuedWarnings?: Set<string> }).litIssuedWarnings?.clear();
  wrap = document.createElement('div');
  wrap.style.width = '480px';
  document.body.appendChild(wrap);
});
afterEach(() => { wrap.remove(); vi.restoreAllMocks(); });

const frame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 30)));
const litWarnings = (warn: { mock: { calls: unknown[][] } }) =>
  warn.mock.calls.map(([m]) => String(m)).filter((m) => m.includes('scheduled an update')).map((m) => m.slice(0, 60));

describe('u-chart-block — Lit 개발 모드 경고', () => {
  it('🔴정상 그리기와 데이터 바꾸기가 «갱신 뒤 갱신» 경고를 내지 않는다', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const el = document.createElement('u-chart-block') as UChartBlock;
    Object.assign(el, { type: 'bar', data: { labels: ['a', 'b'], datasets: [{ data: [1, 2] }] } });
    wrap.appendChild(el);
    await el.updateComplete;
    await frame();
    el.data = { labels: ['a', 'b', 'c'], datasets: [{ data: [3, 2, 1] }] };
    await el.updateComplete;
    await frame();
    expect(litWarnings(warn)).toEqual([]);
  });
});
