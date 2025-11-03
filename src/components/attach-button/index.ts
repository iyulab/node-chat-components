import { AttachButton } from "./AttachButton";

AttachButton.define("u-attach-button");

declare global {
  interface HTMLElementTagNameMap {
    "u-attach-button": AttachButton;
  }
}

export { AttachButton };