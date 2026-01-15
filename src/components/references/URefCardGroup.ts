import { URefCardGroup } from "./URefCardGroup.component.js";

URefCardGroup.define('u-ref-card-group');

declare global {
  interface HTMLElementTagNameMap {
    "u-ref-card-group": URefCardGroup;
  }
}

export { URefCardGroup };
