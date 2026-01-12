import { UChatInput } from "./UChatInput.component.js";

UChatInput.define("u-chat-input");

declare global {
  interface HTMLElementTagNameMap {
    "u-chat-input": UChatInput;
  }
}

export { UChatInput };
