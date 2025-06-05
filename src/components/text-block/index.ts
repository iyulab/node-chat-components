import { UcTextBlock } from "./TextBlock";

export { UcTextBlock };

customElements.define("uc-text-block", UcTextBlock);

declare global {
  interface HTMLElementTagNameMap {
    "uc-text-block": UcTextBlock;
  }
}
