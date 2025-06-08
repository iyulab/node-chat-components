import { Icon } from "./Icon";

export { Icon };

Icon.define("uc-icon");

declare global {
  interface HTMLElementTagNameMap {
    "uc-icon": Icon;
  }
}
