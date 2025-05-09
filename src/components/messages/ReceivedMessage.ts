import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { format, base64 } from '../../internal';

@customElement('received-message')
export class ReceivedMessage extends LitElement {

  @property({ type: String }) avatar?: string;
  @property({ type: String }) name?: string;
  @property({ type: String }) timestamp?: string;

  render() {
    return html`
      <div class="container">
        <!-- Avatar -->
        <img class="avatar" 
          src=${this.avatar || base64.get('blank-avatar') || ''}
          alt="Avatar" />

        <!-- Main -->
        <div class="main">
          ${this.name 
            ? html`<div class="header">${this.name}</div>` 
            : nothing}
          <div class="body">
            <slot></slot>
          </div>
          ${this.timestamp 
            ? html`<div class="footer">${format(this.timestamp)}</div>` 
            : nothing}
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .container {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: auto;
    }

    .avatar {
      width: 34px;
      height: 34px;
      border: 1px solid var(--uc-border-color-mid);
      border-radius: 50%;
      margin-right: 16px;
      box-sizing: border-box;
    }

    .main {
      flex: 1;
      display: flex;
      flex-direction: column;

      .header {
        align-self: flex-start;
        font-family: 'Roboto', sans-serif;
        font-size: 16px;
        font-weight: 600;
        line-height: 1.5;
        margin-bottom: 12px;
      }

      .body {
        display: flex;
        flex-direction: column;
        background-color: transparent;
      }

      .footer {
        align-self: flex-end;
        font-size: 12px;
        line-height: 1.5;
        opacity: 0.7;
        margin-top: 12px;
      }
    }
  `;
}
