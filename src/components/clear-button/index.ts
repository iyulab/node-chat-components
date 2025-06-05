import { UcClearButton } from "./ClearButton";

export { UcClearButton };

customElements.define("uc-clear-button", UcClearButton);

declare global {
  interface HTMLElementTagNameMap {
    "uc-clear-button": UcClearButton;
  }
}
