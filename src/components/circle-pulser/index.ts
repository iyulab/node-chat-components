import { UcCirclePulser } from "./CirclePulser";

export { UcCirclePulser };

customElements.define("uc-circle-pulser", UcCirclePulser);

declare global {
  interface HTMLElementTagNameMap {
    "uc-circle-pulser": UcCirclePulser;
  }
}
