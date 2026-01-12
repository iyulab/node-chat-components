import { UCitationTag } from "./UCitationTag.component.js";

UCitationTag.define("u-citation-tag");

declare global {
  interface HTMLElementTagNameMap {
    "u-citation-tag": UCitationTag;
  }
}

export { UCitationTag };
export type * from "../message/UMessage.types.js";
