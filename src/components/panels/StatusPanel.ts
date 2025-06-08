import { html } from 'lit';
import { property } from 'lit/decorators.js';

import { BaseElement } from '../../internal/BaseElement.js';
import { PulseLoader } from '../loaders/PulseLoader.js';
import { BarLoader } from '../loaders/BarLoader.js';
import { styles } from './StatusPanel.styles.js';

export class StatusPanel extends BaseElement {
  static dependencies: Record<string, typeof BaseElement> = {
    'uc-pulse-loader': PulseLoader,
    'uc-bar-loader': BarLoader,
  };
  static styles = [ styles ];

  @property({ type: String }) 
  status: 'pending' | 'processing' = 'pending';

  render() {
    return html`
      <div class="container">
        <div class="title">
          ${this.status.toUpperCase()}
        </div>
        <div class="indicator">
          ${this.status === 'pending' 
            ? html`<uc-pulse-loader></uc-pulse-loader>`
            : html`<uc-bar-loader></uc-bar-loader>`}
        </div>
      </div>
    `;
  }
}