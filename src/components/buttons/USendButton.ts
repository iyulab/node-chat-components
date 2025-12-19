import { USendButton } from "./USendButton.component.js";

USendButton.define("u-send-button");

declare global {
  interface HTMLElementTagNameMap {
    "u-send-button": USendButton;
  }
}

export { USendButton };