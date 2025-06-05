import { UcButton } from "./Button";

export { UcButton };

customElements.define("uc-button", UcButton);

declare global {
  interface HTMLElementTagNameMap {
    "uc-button": UcButton;
  }
}
