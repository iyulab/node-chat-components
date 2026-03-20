import { UView } from "./UView.component.js";

UView.define("u-view");

declare global {
  interface HTMLElementTagNameMap {
    "u-view": UView;
  }
}

export { UView };
