import { UFilesBlock } from "./UFilesBlock.component.js";

UFilesBlock.define("u-files-block");

declare global {
  interface HTMLElementTagNameMap {
    "u-files-block": UFilesBlock;
  }
}

export { UFilesBlock };
