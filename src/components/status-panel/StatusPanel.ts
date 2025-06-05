import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { styles } from './StatusPanel.styles';

export class UcStatusPanel extends LitElement {
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
            ? html`<uc-circle-pulser></uc-circle-pulser>`
            : html`<uc-bar-loader></uc-bar-loader>`}
        </div>
      </div>
    `;
  }
}