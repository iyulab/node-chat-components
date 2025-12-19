import { UThinkBlock } from "./UThinkBlock.component.js";

UThinkBlock.define("u-think-block");

declare global {
  interface HTMLElementTagNameMap {
    "u-think-block": UThinkBlock;
  }
}

export { UThinkBlock };