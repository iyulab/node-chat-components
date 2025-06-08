import { Button } from "./Button";

export { Button };

Button.define("uc-button");

declare global {
  interface HTMLElementTagNameMap {
    "uc-button": Button;
  }
}
