import { UFileBlock } from "./UFileBlock.component.js";

UFileBlock.define("u-file-block");

declare global {
  interface HTMLElementTagNameMap {
    "u-file-block": UFileBlock;
  }
}

export { UFileBlock };
