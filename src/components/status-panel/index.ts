import { UcStatusPanel } from "./StatusPanel";

export { UcStatusPanel };

customElements.define("uc-status-panel", UcStatusPanel);

declare global {
  interface HTMLElementTagNameMap {
    "uc-status-panel": UcStatusPanel;
  }
}
