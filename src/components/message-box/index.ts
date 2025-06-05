import { UcMessageBox } from "./MessageBox";

export { UcMessageBox };
export type * from "./MessageBox.types";

customElements.define("uc-message-box", UcMessageBox);

declare global {
  interface HTMLElementTagNameMap {
    "uc-message-box": UcMessageBox;
  }
}