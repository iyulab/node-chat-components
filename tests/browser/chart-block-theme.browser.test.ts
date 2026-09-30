import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Chart } from 'chart.js/auto';
import '../../src/components-extra/UChartBlock.js';
import type { UChartBlock } from '../../src/components-extra/UChartBlock.js';

/**
 * **`u-chart-block` 의 테마는 «그 차트» 에만 들어간다 — 그리고 하우스 팔레트를 받는다.**
 *
 * 종전 판은 테마 색을 `Chart.defaults` 에 썼다. 전역이라 같은 페이지에서 소비자가 직접 만든
 * chart.js 차트의 글자·격자·툴팁 색까지 바뀌었다. 그리고 데이터셋 색은 chart.js 기본값이어서
 * components 시트의 `--u-chart-color-*`(대시보드·u-widgets 가 쓰는 팔레트)와 달랐다.
 *
 * 이 파일은 셋을 고정한다: ⑴ 전역 기본값을 바꾸지 않는다 ⑵ 색을 주지 않은 데이터셋은 팔레트를
 * 받고, 준 것은 그대로다 ⑶ 테마 색은 인스턴스 옵션이라 소비자 옵션이 이긴다.
 */

let wrap: HTMLDivElement;
beforeEach(() => {
  wrap = document.createElement('div');
  wrap.style.width = '480px';
  // 시트 대신 토큰을 직접 준다 — 이 시험은 «읽어서 쓰는가» 를 잰다.
  wrap.style.setProperty('--u-chart-color-1', 'rgb(10, 20, 30)');
  wrap.style.setProperty('--u-chart-color-2', 'rgb(40, 50, 60)');
  wrap.style.setProperty('--u-chart-color-3', 'rgb(70, 80, 90)');
  wrap.style.setProperty('--u-txt-color', 'rgb(1, 2, 3)');
  wrap.style.setProperty('--u-txt-color-weak', 'rgb(4, 5, 6)');
  wrap.style.setProperty('--u-border-color', 'rgb(7, 8, 9)');
  wrap.style.setProperty('--u-bg-color', 'rgb(250, 250, 250)');
  document.body.appendChild(wrap);
});
afterEach(() => wrap.remove());

async function mount(props: Partial<UChartBlock>): Promise<Chart> {
  const el = document.createElement('u-chart-block') as UChartBlock;
  Object.assign(el, props);
  wrap.appendChild(el);
  await el.updateComplete;
  // createChart 는 updated 에서 돈다 — 한 프레임 뒤에 인스턴스가 있다.
  await new Promise((r) => requestAnimationFrame(() => r(null)));
  const canvas = el.shadowRoot!.querySelector('canvas')!;
  const chart = Chart.getChart(canvas);
  expect(chart, 'chart instance').toBeTruthy();
  return chart!;
}

describe('u-chart-block theme', () => {
  it('does not change chart.js global defaults', async () => {
    const before = {
      color: Chart.defaults.color,
      border: Chart.defaults.borderColor,
      tooltip: Chart.defaults.plugins.tooltip.backgroundColor,
      ticks: Chart.defaults.scale.ticks.color,
    };
    await mount({ type: 'bar', data: { labels: ['a', 'b'], datasets: [{ data: [1, 2] }] } });
    expect({
      color: Chart.defaults.color,
      border: Chart.defaults.borderColor,
      tooltip: Chart.defaults.plugins.tooltip.backgroundColor,
      ticks: Chart.defaults.scale.ticks.color,
    }).toEqual(before);
  });

  it('applies the theme to its own instance (text, ticks, grid, tooltip)', async () => {
    const chart = await mount({ type: 'line', data: { labels: ['a'], datasets: [{ data: [1] }] } });
    const o = chart.options as any;
    expect(o.color).toBe('rgb(1, 2, 3)');
    expect(o.scales.x.ticks.color).toBe('rgb(4, 5, 6)');
    expect(o.scales.y.grid.color).toBe('rgb(7, 8, 9)');
    expect(o.plugins.tooltip.backgroundColor).toBe('rgb(250, 250, 250)');
  });

  it('paints datasets without colours from the palette and keeps given colours', async () => {
    const chart = await mount({
      type: 'bar',
      data: {
        labels: ['a', 'b'],
        datasets: [{ data: [1, 2] }, { data: [3, 4], backgroundColor: 'rgb(200, 0, 0)' }],
      },
    });
    const [a, b] = chart.data.datasets as any[];
    expect(a.backgroundColor).toBe('rgb(10, 20, 30)');
    expect(a.borderColor).toBe('rgb(10, 20, 30)');
    expect(b.backgroundColor).toBe('rgb(200, 0, 0)');
    expect(b.borderColor).toBe('rgb(40, 50, 60)');
  });

  it('gives each slice of a pie its own palette colour (cycling)', async () => {
    const chart = await mount({
      type: 'pie',
      data: { labels: ['a', 'b', 'c', 'd'], datasets: [{ data: [1, 2, 3, 4] }] },
    });
    const ds = chart.data.datasets[0] as any;
    expect(ds.backgroundColor).toEqual([
      'rgb(10, 20, 30)',
      'rgb(40, 50, 60)',
      'rgb(70, 80, 90)',
      'rgb(10, 20, 30)',
    ]);
    // 원형 차트에는 축이 생기지 않는다.
    expect(Object.keys(chart.scales)).toEqual([]);
  });

  it('lets consumer options win over the theme', async () => {
    const chart = await mount({
      type: 'bar',
      data: { labels: ['a'], datasets: [{ data: [1] }] },
      options: { scales: { x: { ticks: { color: 'rgb(0, 128, 0)' } } } } as any,
    });
    const o = chart.options as any;
    expect(o.scales.x.ticks.color).toBe('rgb(0, 128, 0)');
    expect(o.scales.x.grid.color).toBe('rgb(7, 8, 9)');
  });

  it('does not mutate the data object it was given', async () => {
    const data = { labels: ['a'], datasets: [{ data: [1] }] };
    await mount({ type: 'bar', data });
    expect(data.datasets[0]).toEqual({ data: [1] });
  });
});
