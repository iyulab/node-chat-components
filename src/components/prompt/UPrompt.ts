import { UPrompt } from "./UPrompt.component.js";

UPrompt.define("u-prompt");

declare global {
  interface HTMLElementTagNameMap {
    "u-prompt": UPrompt;
  }
}

export { UPrompt };
