import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

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
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: auto;
      height: auto;
    }

    .container {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-end;
    }

    .body {
      display: inline-flex;
      padding: 8px;
      border: none;
      border-radius: 8px;
      box-sizing: border-box;
      background-color: var(--uc-background-color-200);
    }

    .footer {
      width: 100%;
      margin-top: 12px;
    }
  `;
}