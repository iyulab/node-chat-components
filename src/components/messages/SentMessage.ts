import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { format } from '../../internal';

@customElement('sent-message')
export class SentMessage extends LitElement {

  @property({ type: String }) timestamp?: string;

  render() {
    return html`
      <div class="container">
        <div class="body">
          <slot></slot>
        </div>
        <div class="footer">
          ${format(this.timestamp)}
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: auto;
    }

    .container {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: flex-start;
    }

    .body {
      display: inline-flex;
      padding: 8px;
      border: none;
      border-radius: 8px;
      box-sizing: border-box;
      background-color: var(--uc-background-color-500);
    }

    .footer {
      align-self: flex-end;
      font-size: 12px;
      line-height: 1.5;
      opacity: 0.7;
      margin-top: 12px;
    }
  `;
}