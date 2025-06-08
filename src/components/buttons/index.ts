import { ClearButton } from "./ClearButton";
import { CopyButton } from "./CopyButton";

export { ClearButton };
export { CopyButton };

ClearButton.define("uc-clear-button");
CopyButton.define("uc-copy-button");

declare global {
  interface HTMLElementTagNameMap {
    "uc-clear-button": ClearButton;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "uc-copy-button": CopyButton;
  }
}
