import { UWidget } from "./UWidget.component.js";

UWidget.define("u-widget");

declare global {
  interface HTMLElementTagNameMap {
    "u-widget": UWidget;
  }
}

export { UWidget };
