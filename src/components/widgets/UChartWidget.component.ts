import { html, nothing, PropertyValues } from "lit";
import { property, query } from "lit/decorators.js";

import { Chart } from "chart.js/auto";
import type { ChartType, ChartData, ChartOptions } from "chart.js/auto";
import { BaseElement } from "@iyulab/components/dist/components/BaseElement.js";
import { styles } from "./UChartWidget.styles.js";

/**
 * 차트 위젯 컴포넌트
 * Chart.js를 사용하여 다양한 차트를 렌더링
 */
export class UChartWidget extends BaseElement {
  static styles = [super.styles, styles];
  static dependencies: Record<string, typeof BaseElement> = {};

  /** 차트 유형 (bar, line, pie 등) */
  @property({ type: String }) type?: ChartType;
  /** 차트 데이터 */
  @property({ type: Object }) data?: ChartData;
  /** 차트 옵션 */
  @property({ type: Object }) options?: ChartOptions;

  @query('canvas') private canvas?: HTMLCanvasElement;

  private chartjs: Chart | null = null;

  disconnectedCallback() {
    super.disconnectedCallback();
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

    return html`<canvas></canvas>`;
  }

  private createChart() {
    if (!this.canvas) return;
    if (!this.type || !this.data) return;

    this.destroyChart();

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    this.chartjs = new Chart(ctx, {
      type: this.type,
      data: this.data,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        ...this.options,
      },
    });
  }

  private destroyChart() {
    if (this.chartjs) {
      this.chartjs.destroy();
      this.chartjs = null;
    }
  }
}
