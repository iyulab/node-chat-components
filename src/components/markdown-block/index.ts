import { UcMarkdownblock } from "./MarkdownBlock";

export { UcMarkdownblock };

customElements.define("uc-markdown-block", UcMarkdownblock)

declare global {
  interface HTMLElementTagNameMap {
    "uc-markdown-block": UcMarkdownblock;
  }
}
