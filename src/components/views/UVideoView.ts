import { UVideoView } from "./UVideoView.component.js";

UVideoView.define("u-video-view");

declare global {
  interface HTMLElementTagNameMap {
    "u-video-view": UVideoView;
  }
}

export { UVideoView };
