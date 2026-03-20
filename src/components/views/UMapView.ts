import { UMapView } from "./UMapView.component.js";

UMapView.define("u-map-view");

declare global {
  interface HTMLElementTagNameMap {
    "u-map-view": UMapView;
  }
}

export { UMapView };
