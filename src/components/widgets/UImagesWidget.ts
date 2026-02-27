import { UImagesWidget } from "./UImagesWidget.component.js";

UImagesWidget.define("u-images-widget");

declare global {
  interface HTMLElementTagNameMap {
    "u-images-widget": UImagesWidget;
  }
}

export { UImagesWidget };
