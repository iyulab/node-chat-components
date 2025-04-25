import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { Message } from "../../types";

@customElement('chat-room')
export class ChatRoom extends LitElement {

  @property({ type: Boolean, reflect: true }) loading: boolean = false;
  @property({ type: Array }) messages: Message[] = [];

  render() {
    return html` 
      <div class="container">
        <message-box
          .messages=${this.messages}
        ></message-box>
        
        <message-input
          .loading=${this.loading}
          placeholder="Type a message..."
        ></message-input>
      </div>
    `;
  }

  static styles = css`
    :host {
      width: 100%;
      height: 100%;
    }

    .container {
      position: relative;
      width: 100%;
      height: 100%;
      min-width: 320px;
      min-height: 480px;
      color: var(--hs-text-color);
      background-color: var(--hs-background-color);
      overflow: hidden;
    }

    message-box {
      position: relative;
      width: 100%;
      height: 100%;
      padding: 32px 20% 140px 20%;
    }

    message-input {
      position: absolute;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
    }
  `;
}
