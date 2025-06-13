import { html } from 'lit';

import { BaseElement } from '../../internal/BaseElement.js';
import { styles } from './PulseLoader.styles.js';

/**
 * 원형으로 펄스 효과를 주는 컴포넌트입니다.
 */
export class PulseLoader extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {};

  render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <circle class="circle" cx="12" cy="12" r="0"/>
      </svg>
    `;
  }
}
