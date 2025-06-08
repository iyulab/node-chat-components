import { MessageInput } from "./MessageInput";

export { MessageInput };

MessageInput.define("uc-message-input");

declare global {
  interface HTMLElementTagNameMap {
    "uc-message-input": MessageInput;
  }
}