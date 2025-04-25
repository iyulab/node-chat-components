import { LitElement, html, css, nothing, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import type { Message } from '../../types';

@customElement('message-box')
export class MessageBox extends LitElement {
  private observer: ResizeObserver = new ResizeObserver(this.updateFillHeight.bind(this));
  private lastCount: number = 0;

  @property({ type: Array })
  messages: Message[] = [];

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
      <div class="container">
        ${repeat(this.messages, (msg) => msg.timestamp, (msg) => msg.role === 'user'
          ? html`
              <user-message class="message user"
                .timestamp=${msg.timestamp}>
                ${msg.content?.map(content => content.type === 'text' 
                  ? html`<text-block .value=${content.value}></text-block>` 
                  : nothing)}
              </user-message>
            `
          : html`
              <bot-message class="message bot"
                .name=${msg.name}
                .avatar=${'/assets/images/user-avatar.png'}
                .timestamp=${msg.timestamp}>
                ${msg.content?.map(content => content.type === 'text'
                  ? html`<marked-block .value=${content.value}></marked-block>`
                  : content.type === 'tool'
                  ? html`<tool-block .value=${content}></tool-block>`
                  : nothing)}
              </bot-message>
          `)}
      </div>
    `;
  }

  /**
   * 현재 엘리먼트의 스크롤을 최상단으로 이동합니다.
   */
  public scrollToTop = () => {
    this.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  /**
   * 현재 엘리먼트의 스크롤을 최하단으로 이동합니다.
   */
  public scrollToBottom = () => {
    this.scrollTo({ top: this.scrollHeight, behavior: 'smooth' });
  }

  // 현재 엘리먼트의 높이를 계산하여 --host-height CSS 변수를 업데이트합니다.
  private updateFillHeight() {
    const hostHeight = this.getBoundingClientRect().height;
    const hostStyle = getComputedStyle(this);
    const containerStyle = getComputedStyle(this.shadowRoot?.querySelector('.container')!);
    const paddingBottom = hostStyle.getPropertyValue('padding-bottom');
    const paddingTop = hostStyle.getPropertyValue('padding-top');
    const messageGap = containerStyle.getPropertyValue('gap');

    // 전체 높이 - 상단패딩 - 메시지 간격 - 하단패딩 = 채워야 할 높이
    const fillHeight = hostHeight 
      - parseFloat(paddingTop)  
      - parseFloat(messageGap)
      - parseFloat(paddingBottom);
    this.style.setProperty('--fill-height', `${fillHeight}px`);
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      box-sizing: border-box;
      padding: 64px;

      --message-gap: 24px;
      --fill-height: 100%;
    }

    .container {
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      gap: var(--message-gap);
    }
    .container > :last-child {
      min-height: var(--fill-height);
    }

    user-message {
      width: auto;
      height: auto;
      align-self: flex-end;
    }
    
    bot-message {
      width: 100%;
      height: auto;
      align-self: flex-start;
    }
  `;
}
