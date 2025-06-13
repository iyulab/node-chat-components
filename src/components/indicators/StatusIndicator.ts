import { html } from 'lit';
import { property } from 'lit/decorators.js';

import { BaseElement } from '../../internal/BaseElement.js';
import { BarBounceLoader } from '../loaders/BarBounceLoader.js';
import { PulseLoader } from '../loaders/PulseLoader.js';
import { styles } from './StatusIndicator.styles.js';

/**
 * "대기" or "로딩" 상태를 표시하는 컴포넌트입니다.
 */
export class StatusIndicator extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'uc-bar-bounce-loader': BarBounceLoader,
    'uc-pulse-loader': PulseLoader,
  };

  /** 컴포넌트의 상태를 나타내는 속성입니다. */
  @property({ type: String }) status: 'pending' | 'loading' = 'pending';

  render() {
    return html`
      <div class="container">
        <div class="title">
          ${this.status.toUpperCase()}
        </div>
        <div class="loader">
          ${this.status === 'pending' 
            ? html`<uc-pulse-loader></uc-pulse-loader>`
            : html`<uc-bar-bounce-loader></uc-bar-bounce-loader>`}
        </div>
      </div>
    `;
  }
}