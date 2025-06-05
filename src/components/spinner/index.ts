import { UcSpinner } from "./Spinner";

export { UcSpinner };

customElements.define("uc-spinner", UcSpinner);

declare global {
  interface HTMLElementTagNameMap {
    "uc-spinner": UcSpinner;
  }
}