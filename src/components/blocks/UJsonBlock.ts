import { UJsonBlock } from './UJsonBlock.component.js';

UJsonBlock.define('u-json-block');

declare global {
  interface HTMLElementTagNameMap {
    'u-json-block': UJsonBlock;
  }
}

export { UJsonBlock };