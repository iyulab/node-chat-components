import { StatusPanel } from "./StatusPanel";
import { TokenPanel } from "./TokenPanel";

export { StatusPanel };
export { TokenPanel };

StatusPanel.define("uc-status-panel");
TokenPanel.define("uc-token-panel");

declare global {
  interface HTMLElementTagNameMap {
    "uc-status-panel": StatusPanel;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "uc-token-panel": TokenPanel;
  }
}