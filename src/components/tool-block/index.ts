import { ToolBlock } from "./ToolBlock";

ToolBlock.define("u-tool-block");

declare global {
  interface HTMLElementTagNameMap {
    "u-tool-block": ToolBlock;
  }
}

export { ToolBlock };