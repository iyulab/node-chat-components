import { UChartView } from "./UChartView.component.js";

UChartView.define("u-chart-view");

declare global {
  interface HTMLElementTagNameMap {
    "u-chart-view": UChartView;
  }
}

export { UChartView };
