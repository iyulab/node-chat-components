import { Alert } from "./Alert";

export { Alert };

Alert.define("uc-alert");

declare global {
  interface HTMLElementTagNameMap {
    "uc-alert": Alert;
  }
}