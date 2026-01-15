import { URefTag } from './URefTag.component.js';

URefTag.define('u-ref-tag');

declare global {
  interface HTMLElementTagNameMap {
    'u-ref-tag': URefTag;
  }
}

export { URefTag };
