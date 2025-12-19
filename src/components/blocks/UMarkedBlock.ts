import { UMarkedBlock } from "./UMarkedBlock.component.js";

UMarkedBlock.define("u-marked-block");

declare global {
  interface HTMLElementTagNameMap {
    "u-marked-block": UMarkedBlock;
  }
}

export { UMarkedBlock };