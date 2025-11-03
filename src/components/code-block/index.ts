import { CodeBlock } from "./CodeBlock";

CodeBlock.define("uc-code-block");

declare global {
  interface HTMLElementTagNameMap {
    "uc-code-block": CodeBlock;
  }
}

export { CodeBlock };