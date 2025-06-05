import { UcModelSelect } from "./ModelSelect";

export { UcModelSelect };
export type { ModelSummary } from "./ModelSelect.types";

customElements.define("uc-model-select", UcModelSelect);

declare global {
  interface HTMLElementTagNameMap {
    "uc-model-select": UcModelSelect;
  }
}