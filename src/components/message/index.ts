import { Message } from "./Message";

export { Message };
export type * from "./Message.types";

Message.define("uc-message");

declare global {
  interface HTMLElementTagNameMap {
    "uc-message": Message;
  }
}
