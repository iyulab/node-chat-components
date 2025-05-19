import { LitElement, html, css, PropertyValues, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { Message } from '../../types';
import { ToolBlock } from '../blocks';

@customElement('message-box')
export class MessageBox extends LitElement {
  private observer: ResizeObserver = new ResizeObserver(this.updateFillHeight.bind(this));
  private lastCount: number = 0;

  @query('.messages') messagesEl!: HTMLElement;
  @property({ type: Array }) messages: Message[] = [];

  // 엘리먼트의 크기가 변경될 때마다 --fill-height를 업데이트합니다.
  protected firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);

    this.observer.observe(this);
    this.updateFillHeight();
  }

  // 새로운 메시지가 추가되었을 때 스크롤을 하단으로 이동합니다.
  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('messages') && this.messages) {
      if(this.lastCount === this.messages.length) return;
      this.lastCount = this.messages.length;
      this.scrollToBottom();
    }
  }

  // Resource를 해제합니다.
  disconnectedCallback() {
    this.observer.disconnect();
    super.disconnectedCallback();
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
                  ? repeat(msg.content, (c) => c.index, c => {
                    const isLast = msg.content?.length === (c.index || 0) + 1;
                    return c.type === 'thinking'
                    ? html`<thinking-block .value=${c.value} ?loading=${isLast}></thinking-block>`
                    : c.type === 'text'
                    ? html`<marked-block .value=${c.value}></marked-block>`
                    : c.type === 'tool'
                    ? html`<tool-block .value=${c} @tool-change=${this.contentChanged}></tool-block>`
                    : nothing;
                  })
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
  public scrollToTop = async () => {
    await this.updateComplete;
    if (!this.messagesEl) return;
    requestAnimationFrame(() => {
      this.messagesEl.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  /**
   * 현재 엘리먼트의 스크롤을 최하단으로 이동합니다.
   */
  public scrollToBottom = async () => {
    await this.updateComplete;
    if (!this.messagesEl || this.messagesEl.scrollHeight === 0) return;
    requestAnimationFrame(() => {
      this.messagesEl.scrollTo({ top: this.messagesEl.scrollHeight, behavior: 'smooth' });
    });
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

  private contentChanged = (e: CustomEvent) => {
    const target = e.target as any;
    if (target instanceof ToolBlock) {
      const last = this.messages[this.messages.length - 1];
      if (last.role === 'assistant') {
        const index = target.value?.index || 0;
        if (last.content && last.content[index]) {
          last.content[index] = target.value!;
          this.dispatchEvent(new CustomEvent('tool-change', {
            detail: this.messages,
          }));
        }
      }
    }
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
      border: 1px solid var(--uc-border-color-mid);
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
