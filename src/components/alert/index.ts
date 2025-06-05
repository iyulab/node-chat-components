import { UcAlert } from "./Alert";

export { UcAlert };

customElements.define("uc-alert", UcAlert);

declare global {
  interface HTMLElementTagNameMap {
    "uc-alert": UcAlert;
  }
}