import { ThinkingBlock } from "./ThinkingBlock";

ThinkingBlock.define("u-thinking-block");

declare global {
  interface HTMLElementTagNameMap {
    "u-thinking-block": ThinkingBlock;
  }
}

export { ThinkingBlock };