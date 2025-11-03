import { TokenIndicator } from "./TokenIndicator";

TokenIndicator.define("u-token-indicator");

declare global {
  interface HTMLElementTagNameMap {
    "u-token-indicator": TokenIndicator;
  }
}

export { TokenIndicator };