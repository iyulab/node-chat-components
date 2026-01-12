import { USpeakButton } from './USpeakButton.component.js';

USpeakButton.define('u-speak-button');

declare global {
  interface HTMLElementTagNameMap {
    'u-speak-button': USpeakButton;
  }
}

export { USpeakButton };