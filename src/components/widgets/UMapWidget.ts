import { UMapWidget } from "./UMapWidget.component.js";

UMapWidget.define("u-map-widget");

declare global {
  interface HTMLElementTagNameMap {
    "u-map-widget": UMapWidget;
  }
}

export { UMapWidget };
