import { html, nothing, PropertyValues } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { Chart, type ChartType, type ChartData, type ChartOptions } from "chart.js/auto";

import { messages } from "../utilities/messages.js";
import "@iyulab/components/dist/components/icon/UIcon.js";
import "@iyulab/components/dist/components/button/UButton.js";
import { UElement } from "@iyulab/components/dist/components/UElement.js";
import "../utilities/icons.js";
import { styles } from "./UChartBlock.styles.js";
import { registerElementBlock } from '../utilities/ElementRegistry.js';
import schema from './UChartBlock.schema.js';

// 이 모듈을 import 하면 block-json 으로 렌더할 수 있다(스키마가 허용 목록이다).
registerElementBlock(schema);

/**
 * Chart.js를 사용하여 다양한 차트를 렌더링하는 블록 컴포넌트입니다.
 */
@customElement('u-chart-block')
export class UChartBlock extends UElement {
  static styles = [super.styles, styles];

  /** 차트 유형 (bar, line, pie 등) */
  @property({ type: String }) type?: ChartType;
  /** 차트 데이터 */
  @property({ type: Object }) data?: ChartData;
  /** 차트 옵션 */
  @property({ type: Object }) options?: ChartOptions;

  @query('canvas') private canvas?: HTMLCanvasElement;
  @query('.viewport') private viewport?: HTMLElement;

  /** 차트 생성 에러 메시지 */
  @state() private error: string | null = null;

  private chartjs: Chart | null = null;
  private observer?: MutationObserver;

  connectedCallback() {
    super.connectedCallback();
    // 다크/라이트 테마 전환 감지 → 차트 재생성 (내부에서 테마 적용)
    this.observer = new MutationObserver(() => {
      this.createChart();
    });
    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['theme'],
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.observer?.disconnect();
    this.destroyChart();
  }

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (['data','type','options'].some(k => changedProperties.has(k))) {
      this.createChart();
    }
  }

  render() {
    if (!this.data) return nothing;

    return html`
      <div class="toolbar">
        <div class="toolbar-left"></div>
        <div class="toolbar-right">
          <u-button title=${messages.text('pngDownload')} @click=${this.handleDownloadPNG}>
            PNG
            <u-icon slot="suffix" lib="internal-chat" name="download"></u-icon>
          </u-button>
          <u-button title=${messages.text('jsonDownload')} @click=${this.handleDownloadJSON}>
            JSON
            <u-icon slot="suffix" lib="internal-chat" name="download"></u-icon>
          </u-button>
          <u-button class="fullscreen-btn" title=${messages.text('fullScreen')} aria-label=${messages.text('fullScreen')} @click=${this.handleFullscreen}>
            <u-icon lib="internal-chat" name="external-link"></u-icon>
          </u-button>
        </div>
      </div>
      <div class="viewport">
        <canvas></canvas>
        <div class="error-overlay" ?hidden=${!this.error}>
          <u-icon lib="internal-chat" name="alert-triangle-fill"></u-icon>
          <span>${this.error}</span>
        </div>
      </div>
    `;
  }

  /** Chart.js로 차트 생성 */
  private async createChart() {
    if (!this.canvas) return;
    if (!this.type || !this.data) return;

    this.destroyChart();
    this.error = null;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      this.error = messages.text('canvasUnavailable');
      return;
    }

    try {
      const theme = this.readTheme();
      this.chartjs = new Chart(ctx, {
        type: this.type,
        data: paintDatasets(this.type, this.data, theme),
        options: mergeOptions(themeOptions(this.type, this.data, this.options, theme), {
          responsive: true,
          maintainAspectRatio: true,
          ...this.options,
        }) as ChartOptions,
      });
    } catch (e) {
      this.error = e instanceof Error ? e.message : String(e);
    }
  }

  /** 기존 차트 인스턴스 제거 */
  private destroyChart() {
    if (this.chartjs) {
      this.chartjs.destroy();
      this.chartjs = null;
    }
  }

  /**
   * 현재 테마의 CSS 변수를 읽는다. ⚠`Chart.defaults` 를 바꾸지 않는다 — 전역이라 같은 페이지에서
   * 소비자가 직접 만든 chart.js 차트의 색까지 바꿨다. 값은 이 인스턴스의 옵션으로만 들어간다.
   */
  private readTheme(): ChartTheme {
    const style = getComputedStyle(this);
    const css = (v: string) => style.getPropertyValue(v).trim();
    const palette: string[] = [];
    for (let i = 1; i <= PALETTE_MAX; i++) {
      const c = css(`--u-chart-color-${i}`);
      if (!c) break;
      palette.push(c);
    }
    return {
      text: css('--u-txt-color'),
      weak: css('--u-txt-color-weak'),
      border: css('--u-border-color'),
      background: css('--u-bg-color'),
      palette,
    };
  }

  private handleDownloadPNG() {
    if (!this.chartjs) return;
    const url = this.chartjs.toBase64Image('image/png', 1);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chart-image-${Date.now()}.png`;
    a.click();
  }

  private handleDownloadJSON() {
    if (!this.data) return;
    const json = JSON.stringify(this.data, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chart-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private handleFullscreen() {
    const target = this.viewport ?? this;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      target.requestFullscreen?.();
    }
  }
}

/** 읽어 볼 팔레트 토큰의 상한 — 시트는 여덟을 선언한다. 비어 있는 첫 번호에서 멈춘다. */
const PALETTE_MAX = 12;

interface ChartTheme {
  text: string;
  weak: string;
  border: string;
  background: string;
  /** `--u-chart-color-1..N` — 시트가 없으면 비어 있고, 그때는 chart.js 기본 색을 둔다. */
  palette: string[];
}

type Plain = Record<string, unknown>;

function isPlain(v: unknown): v is Plain {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** `base` 위에 `over` 를 깊게 덮는다 — 소비자가 준 값이 항상 이긴다. 입력은 바꾸지 않는다. */
function mergeOptions(base: Plain, over: Plain): Plain {
  const out: Plain = { ...base };
  for (const [k, v] of Object.entries(over)) {
    out[k] = isPlain(v) && isPlain(out[k]) ? mergeOptions(out[k] as Plain, v) : v;
  }
  return out;
}

const CARTESIAN = new Set(['bar', 'line', 'scatter', 'bubble']);
const RADIAL = new Set(['radar', 'polarArea']);
const PER_POINT = new Set(['pie', 'doughnut', 'polarArea']);

/**
 * 테마 색을 담은 인스턴스 옵션. 축은 «이 차트에 실제로 생길 축» 에만 준다 — 원형 차트에 `x`/`y`
 * 설정을 주면 축이 생길 수 있어서다. 축 id 는 차트 종류의 기본 축 · 소비자가 선언한 축 · 데이터셋이
 * 가리키는 축의 합집합이다.
 */
function themeOptions(type: string, data: ChartData, options: ChartOptions | undefined, t: ChartTheme): Plain {
  const tooltip = {
    backgroundColor: t.background,
    titleColor: t.text,
    bodyColor: t.weak,
    borderColor: t.border,
    borderWidth: 1,
  };
  const ids = new Set<string>(Object.keys((options as Plain | undefined)?.scales ?? {}));
  if (CARTESIAN.has(type)) { ids.add('x'); ids.add('y'); }
  if (RADIAL.has(type)) ids.add('r');
  for (const ds of data.datasets ?? []) {
    const d = ds as unknown as Plain;
    for (const key of ['xAxisID', 'yAxisID', 'rAxisID']) {
      if (typeof d[key] === 'string') ids.add(d[key] as string);
    }
  }
  const scales: Plain = {};
  for (const id of ids) {
    scales[id] = {
      ticks: { color: t.weak },
      grid: { color: t.border },
      ...(RADIAL.has(type) && id === 'r'
        ? { angleLines: { color: t.border }, pointLabels: { color: t.text } }
        : {}),
    };
  }
  return {
    color: t.text,
    borderColor: t.border,
    plugins: { tooltip, legend: { labels: { color: t.text } } },
    ...(ids.size ? { scales } : {}),
  };
}

/**
 * 색을 지정하지 않은 데이터셋에 팔레트를 입힌다. 소비자가 준 `backgroundColor`/`borderColor` 는
 * 건드리지 않고, 입력 객체도 바꾸지 않는다(사본을 돌려준다). 원형 차트는 조각마다 한 색이다.
 */
function paintDatasets(type: string, data: ChartData, t: Pick<ChartTheme, 'palette' | 'background'>): ChartData {
  const p = t.palette;
  if (!p.length || !data.datasets) return data;
  const datasets = data.datasets.map((ds, i) => {
    const d = { ...(ds as unknown as Plain) };
    const has = (k: string) => d[k] !== undefined;
    if (PER_POINT.has(type)) {
      const n = Array.isArray(d.data) ? (d.data as unknown[]).length : 0;
      if (!has('backgroundColor')) d.backgroundColor = Array.from({ length: n }, (_, j) => p[j % p.length]);
      if (!has('borderColor') && t.background) d.borderColor = t.background;
    } else {
      const c = p[i % p.length];
      if (!has('borderColor')) d.borderColor = c;
      if (!has('backgroundColor')) d.backgroundColor = c;
    }
    return d;
  });
  return { ...data, datasets } as unknown as ChartData;
}

declare global {
  interface HTMLElementTagNameMap {
    "u-chart-block": UChartBlock;
  }
}
