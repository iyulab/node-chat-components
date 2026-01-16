import { UMessage } from "./UMessage.component.js";

UMessage.define("u-message");

declare global {
  interface HTMLElementTagNameMap {
    "u-message": UMessage;
  }
}

export { UMessage };
