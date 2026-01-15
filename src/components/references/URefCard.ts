import { URefCard } from "./URefCard.component.js";

URefCard.define('u-ref-card');

declare global {
  interface HTMLElementTagNameMap {
    "u-ref-card": URefCard;
  }
}

export { URefCard };
