import { LitElement, html, css, PropertyValues, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { Message } from '../../types';

@customElement('message-box')
export class MessageBox extends LitElement {
  private observer: ResizeObserver = new ResizeObserver(this.updateFillHeight.bind(this));
  private lastCount: number = 0;

  @query('.messages') messagesEl!: HTMLElement;
  @property({ type: Array }) messages: Message[] = [];

  protected firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);

    // 엘리먼트의 크기가 변경될 때마다 fillHeight를 업데이트합니다.
    this.observer.observe(this);
    this.updateFillHeight();
  }

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    // 새로운 메시지가 추가되었을 때 스크롤을 하단으로 이동합니다.
    if (changedProperties.has('messages')) {
      if(this.lastCount === this.messages.length) return;
      this.lastCount = this.messages.length;
      this.scrollToBottom();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.observer.disconnect();
  }

  render() {
    return html`
      <div class="scroller top" @click=${this.scrollToTop}>
        <uc-icon name="chevron-up"></uc-icon>
      </div>
      <div class="messages">
        ${repeat(this.messages, (msg) => msg.timestamp, (msg) => msg.role === 'user'
          ? html`
              <sent-message
                .timestamp=${msg.timestamp}>
                ${msg.content && msg.content.length > 0
                  ? repeat(msg.content, (c) => c.index, c => c.type === 'text'
                    ? html`<text-block .value=${c.value}></text-block>`
                    : nothing)
                  : nothing}
              </sent-message>`
          : html`
              <received-message
                .name=${msg.name}
                .avatar=${msg.avatar}
                .timestamp=${msg.timestamp}>
                ${msg.content && msg.content.length > 0
                  ? repeat(msg.content, (c) => c.index, c => c.type === 'thinking'
                    ? html`<thinking-block .value=${c.value} ?loading=${msg.content?.length === 1}></thinking-block>`
                    : c.type === 'text'
                    ? html`<marked-block .value=${c.value}></marked-block>`
                    : c.type === 'tool'
                    ? html`<tool-block .value=${c}></tool-block>`
                    : nothing)
                  : nothing}
              </received-message>`)}
      </div>
      <div class="scroller bottom" @click=${this.scrollToBottom}>
        <uc-icon name="chevron-down"></uc-icon>
      </div>
    `;
  }

  /**
   * 현재 엘리먼트의 스크롤을 최상단으로 이동합니다.
   */
  public scrollToTop = () => {
    if (!this.messagesEl) return;
    this.messagesEl.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  /**
   * 현재 엘리먼트의 스크롤을 최하단으로 이동합니다.
   */
  public scrollToBottom = () => {
    if (!this.messagesEl || this.messagesEl.scrollHeight === 0) return;
    this.messagesEl.scrollTo({ top: this.messagesEl.scrollHeight, behavior: 'smooth' });
  }

  // 현재 엘리먼트의 높이를 계산하여 --host-height CSS 변수를 업데이트합니다.
  private updateFillHeight() {
    const hostHeight = this.getBoundingClientRect().height;
    const messagesStyle = getComputedStyle(this.messagesEl);
    const hostStyle = getComputedStyle(this);
    
    const paddingBottom = messagesStyle.getPropertyValue('padding-bottom');
    const paddingTop = messagesStyle.getPropertyValue('padding-top');
    const messageGap = hostStyle.getPropertyValue('--messages-gap');
    
    // 전체 높이 - 상단패딩 - 메시지 간격 - 하단패딩 = 채워야 할 높이
    const fillHeight = hostHeight
      - (parseFloat(paddingTop) ?? 0)
      - (parseFloat(messageGap) ?? 0)
      - (parseFloat(paddingBottom) ?? 0);
    this.style.setProperty('--fill-height', `${fillHeight}px`);
  }

  static styles = css`
    :host {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;

      --messages-padding: 10px 20% 10px 20%;
      --messages-gap: 24px;
      --fill-height: 100%;
    }

    .scroller {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      right: 32px;
      border-radius: 50%;
      cursor: pointer;
      border: 1px solid var(--uc-border-color-100);
    }
    .scroller.top {
      top: 16px;
    }
    .scroller.bottom {
      bottom: 16px;
    }

    .messages {
      display: block;
      width: 100%;
      height: 100%;
      padding: var(--messages-padding);
      box-sizing: border-box;
      overflow-y: auto;
    }
    .messages > *:not(:last-child) {
      margin-bottom: var(--messages-gap);
    }
    .messages > :last-child {
      min-height: var(--fill-height);
    }

    sent-message {
      width: auto;
      height: auto;
      align-self: flex-end;
    }
    
    received-message {
      width: 100%;
      height: auto;
      align-self: flex-start;
    }
  `;
}
