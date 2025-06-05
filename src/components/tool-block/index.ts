import { UcToolBlock } from "./ToolBlock";

export { UcToolBlock };

customElements.define("uc-tool-block", UcToolBlock);

declare global {
  interface HTMLElementTagNameMap {
    "uc-tool-block": UcToolBlock;
  }
}