import { UImagesView } from "./UImagesView.component.js";

UImagesView.define("u-images-view");

declare global {
  interface HTMLElementTagNameMap {
    "u-images-view": UImagesView;
  }
}

export { UImagesView };
