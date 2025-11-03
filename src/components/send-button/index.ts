import { SendButton } from "./SendButton";

SendButton.define("u-send-button");

declare global {
  interface HTMLElementTagNameMap {
    "u-send-button": SendButton;
  }
}

export { SendButton };