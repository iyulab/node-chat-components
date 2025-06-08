import { html } from 'lit';
import { styles } from './PulseLoader.styles.js';

import { BaseElement } from '../../internal/BaseElement.js';

export class PulseLoader extends BaseElement {
  static styles = [ styles ]

  render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <circle class="circle" cx="12" cy="12" r="0"/>
      </svg>
    `;
  }
}
