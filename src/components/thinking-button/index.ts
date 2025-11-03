import { ThinkingButton } from "./ThinkingButton";

ThinkingButton.define("u-thinking-button");

declare global {
  interface HTMLElementTagNameMap {
    "u-thinking-button": ThinkingButton;
  }
}

export { ThinkingButton };