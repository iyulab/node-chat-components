import { UTableBlock } from "./UTableBlock.component.js";

UTableBlock.define("u-table-block");

declare global {
  interface HTMLElementTagNameMap {
    "u-table-block": UTableBlock;
  }
}

export { UTableBlock };
