import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('status-panel')
export class StatusPanel extends LitElement {

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

  static styles = css`
    :host {
      display: block;
      width: 160px;
      height: 80px;

      padding: 8px;
      border-radius: 8px;
      border: 1px solid var(--uc-border-color-low);
      background-color: var(--uc-background-color-0);
      box-shadow: 0 1px 3px var(--uc-shadow-color-low);
      box-sizing: border-box;
    }
    
    .container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .title {
      font-size: 12px;
      line-height: 18px;
      font-weight: 600;
      color: var(--uc-text-color-high);
    }

    .indicator {
      width: 100%;
      height: calc(100% - 18px);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    uc-circle-pulser {
      font-size: 40px;
    }

    uc-bar-loader {
      font-size: 40px;
    }
  `;
}