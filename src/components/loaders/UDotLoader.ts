import { UDotLoader } from "./UDotLoader.component.js";

UDotLoader.define('u-dot-loader');

declare global {
  interface HTMLElementTagNameMap {
    'u-dot-loader': UDotLoader;
  }
}

export { UDotLoader };