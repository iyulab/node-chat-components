import { UChartWidget } from "./UChartWidget.component.js";

UChartWidget.define("u-chart-widget");

declare global {
  interface HTMLElementTagNameMap {
    "u-chart-widget": UChartWidget;
  }
}

export { UChartWidget };
