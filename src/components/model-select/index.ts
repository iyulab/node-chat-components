import { ModelSelect } from "./ModelSelect";

export { ModelSelect };
export type { ModelSummary } from "./ModelSelect.types";

ModelSelect.define("uc-model-select");

declare global {
  interface HTMLElementTagNameMap {
    "uc-model-select": ModelSelect;
  }
}