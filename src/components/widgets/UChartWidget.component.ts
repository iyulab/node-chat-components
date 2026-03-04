import { html, nothing, PropertyValues } from "lit";
import { property, query, state } from "lit/decorators.js";

import type { Chart as ChartInstance, ChartType, ChartData, ChartOptions } from "chart.js/auto";

import { UElement } from "@iyulab/components/dist/components/UElement.js";
import { UIcon } from "@iyulab/components/dist/components/icon/UIcon.component.js";
import { UButton } from "@iyulab/components/dist/components/button/UButton.component.js";
import { styles } from "./UChartWidget.styles.js";

/** chart.js lazy load */
let ChartCtor: typeof ChartInstance | undefined;
async function loadChartJS(): Promise<typeof ChartInstance> {
  if (!ChartCtor) {
    const mod = await import("chart.js/auto");
    ChartCtor = mod.Chart;
  }
  return ChartCtor;
}

/**
 * 차트 위젯 컴포넌트
 * Chart.js를 사용하여 다양한 차트를 렌더링
 */
export class UChartWidget extends UElement {
  static styles = [super.styles, styles];
  static dependencies: Record<string, typeof UElement> = {
    'u-icon': UIcon,
    'u-button': UButton,
  };

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

  private chartjs: ChartInstance | null = null;
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

    if (changedProperties.has('data')
      || changedProperties.has('type')
      || changedProperties.has('options')) {
      this.createChart();
    }
  }

  render() {
    if (!this.data) return nothing;

    return html`
      <div class="toolbar">
        <div class="toolbar-left"></div>
        <div class="toolbar-right">
          <u-button title="PNG Download" @click=${this.handleDownloadPNG}>
            PNG
            <u-icon slot="suffix" lib="internal" name="download"></u-icon>
          </u-button>
          <u-button title="JSON Download" @click=${this.handleDownloadJSON}>
            JSON
            <u-icon slot="suffix" lib="internal" name="download"></u-icon>
          </u-button>
          <u-button title="Full Screen" @click=${this.handleFullscreen}>
            <u-icon lib="internal" name="box-arrow-up-right"></u-icon>
          </u-button>
        </div>
      </div>
      <div class="viewport">
        <canvas></canvas>
        <div class="error-overlay" ?hidden=${!this.error}>
          <u-icon lib="internal" name="exclamation-triangle-fill"></u-icon>
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

    let Chart: typeof ChartInstance;
    try {
      Chart = await loadChartJS();
    } catch {
      this.error = 'chart.js를 로드할 수 없습니다. chart.js 패키지가 설치되어 있는지 확인하세요.';
      return;
    }

    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      this.error = 'Canvas 2D context를 가져올 수 없습니다.';
      return;
    }

    try {
      this.applyTheme(Chart);
      this.chartjs = new Chart(ctx, {
        type: this.type,
        data: this.data,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          ...this.options,
        },
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

  /** 현재 테마의 CSS 변수를 읽어 Chart.defaults에 전역 적용 */
  private applyTheme(Chart: typeof ChartInstance) {
    const css = (v: string) => getComputedStyle(this).getPropertyValue(v).trim();
    const textColor   = css('--u-txt-color');
    const weakColor   = css('--u-txt-color-weak');
    const borderColor = css('--u-border-color');
    const bgColor     = css('--u-bg-color');

    Chart.defaults.color       = textColor;
    Chart.defaults.borderColor = borderColor;

    Chart.defaults.plugins.tooltip.backgroundColor = bgColor;
    Chart.defaults.plugins.tooltip.titleColor      = textColor;
    Chart.defaults.plugins.tooltip.bodyColor       = weakColor;
    Chart.defaults.plugins.tooltip.borderColor     = borderColor;
    Chart.defaults.plugins.tooltip.borderWidth     = 1;

    Chart.defaults.scale.ticks.color = weakColor;
    Chart.defaults.scale.grid.color  = borderColor;
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
