import { URefBlock } from "./URefBlock.component.js";

URefBlock.define("u-ref-block");

declare global {
  interface HTMLElementTagNameMap {
    "u-ref-block": URefBlock;
  }
}

export { URefBlock };
