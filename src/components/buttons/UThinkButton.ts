import { UThinkButton } from "./UThinkButton.component.js";

UThinkButton.define("u-think-button");

declare global {
  interface HTMLElementTagNameMap {
    "u-think-button": UThinkButton;
  }
}

export { UThinkButton };