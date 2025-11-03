import { MarkdownBlock } from "./MarkdownBlock";

MarkdownBlock.define("u-markdown-block");

declare global {
  interface HTMLElementTagNameMap {
    "u-markdown-block": MarkdownBlock;
  }
}

export { MarkdownBlock };