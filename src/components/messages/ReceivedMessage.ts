import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { base64 } from '../../internal';

@customElement('received-message')
export class ReceivedMessage extends LitElement {

  @property({ type: String }) avatar?: string;
  @property({ type: String }) name?: string;

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
          <div class="footer">
            <slot name="footer"></slot>
          </div>
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
      width: calc(100% - 50px);
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
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .footer {
        width: 100%;
        margin-top: 12px;
      }
    }
  `;
}
