import { MessageBox } from "./MessageBox";

export { MessageBox };
export type * from "./MessageBox.types";

MessageBox.define("uc-message-box");

declare global {
  interface HTMLElementTagNameMap {
    "uc-message-box": MessageBox;
  }
}
