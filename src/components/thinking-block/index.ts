import { UcThinkingBlock } from "./ThinkingBlock";

export { UcThinkingBlock };

customElements.define("uc-thinking-block", UcThinkingBlock);

declare global {
  interface HTMLElementTagNameMap {
    "uc-thinking-block": UcThinkingBlock;
  }
}