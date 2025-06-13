import { StatusIndicator } from "./StatusIndicator";
import { TokenIndicator } from "./TokenIndicator";

export { StatusIndicator };
export { TokenIndicator };

StatusIndicator.define("uc-status-indicator");
TokenIndicator.define("uc-token-indicator");

declare global {
  interface HTMLElementTagNameMap {
    "uc-status-indicator": StatusIndicator;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "uc-token-indicator": TokenIndicator;
  }
}