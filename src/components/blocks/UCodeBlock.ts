import { UCodeBlock } from "./UCodeBlock.component.js";

UCodeBlock.define("u-code-block");

declare global {
  interface HTMLElementTagNameMap {
    "u-code-block": UCodeBlock;
  }
}

export { UCodeBlock };