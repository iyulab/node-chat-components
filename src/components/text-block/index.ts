import { TextBlock } from "./TextBlock";

TextBlock.define("u-text-block");

declare global {
  interface HTMLElementTagNameMap {
    "u-text-block": TextBlock;
  }
}

export { TextBlock };