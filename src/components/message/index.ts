import { Message } from "./Message";

Message.define("u-message");

declare global {
  interface HTMLElementTagNameMap {
    "u-message": Message;
  }
}

export { Message };
export type * from "./Message.types";