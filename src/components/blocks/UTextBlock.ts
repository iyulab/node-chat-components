import { UTextBlock } from "./UTextBlock.component.js";

UTextBlock.define("u-text-block");

declare global {
  interface HTMLElementTagNameMap {
    "u-text-block": UTextBlock;
  }
}

export { UTextBlock };