import { UcCopyButton } from "./CopyButton";

export { UcCopyButton };

customElements.define("uc-copy-button", UcCopyButton);

declare global {
  interface HTMLElementTagNameMap {
    "uc-copy-button": UcCopyButton;
  }
}
