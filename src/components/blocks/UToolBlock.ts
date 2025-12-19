import { UToolBlock } from "./UToolBlock.component.js";

UToolBlock.define("u-tool-block");

declare global {
  interface HTMLElementTagNameMap {
    "u-tool-block": UToolBlock;
  }
}

export { UToolBlock };