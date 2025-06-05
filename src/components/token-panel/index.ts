import { UcTokenPanel } from "./TokenPanel";

export { UcTokenPanel };

customElements.define("uc-token-panel", UcTokenPanel);

declare global {
  interface HTMLElementTagNameMap {
    "uc-token-panel": UcTokenPanel;
  }
}