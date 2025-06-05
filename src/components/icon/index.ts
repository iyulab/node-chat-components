import { UcIcon } from "./Icon";

export { UcIcon };

customElements.define("uc-icon", UcIcon);

declare global {
  interface HTMLElementTagNameMap {
    "uc-icon": UcIcon;
  }
}
