import { UAttachButton } from "./UAttachButton.component.js";

UAttachButton.define("u-attach-button");

declare global {
  interface HTMLElementTagNameMap {
    "u-attach-button": UAttachButton;
  }
}

export { UAttachButton };