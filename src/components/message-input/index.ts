import { UcMessageInput } from "./MessageInput";

export { UcMessageInput };

customElements.define("uc-message-input", UcMessageInput);

declare global {
  interface HTMLElementTagNameMap {
    "uc-message-input": UcMessageInput;
  }
}