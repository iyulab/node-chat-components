import { UVideoWidget } from "./UVideoWidget.component.js";

UVideoWidget.define("u-video-widget");

declare global {
  interface HTMLElementTagNameMap {
    "u-video-widget": UVideoWidget;
  }
}

export { UVideoWidget };
