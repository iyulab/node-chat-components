import { UShareButton } from './UShareButton.component.js';

UShareButton.define('u-share-button');

declare global {
  interface HTMLElementTagNameMap {
    'u-share-button': UShareButton;
  }
}

export { UShareButton };
