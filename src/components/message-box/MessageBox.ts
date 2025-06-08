import { html, PropertyValues, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { BaseElement } from '../../internal/BaseElement.js';
import { CopyButton } from '../buttons/CopyButton.js';
import { Icon } from '../icon/Icon.js';
import { TextBlock } from '../blocks/TextBlock.js';
import { MarkdownBlock } from '../blocks/MarkdownBlock.js';
import { ThinkingBlock } from '../blocks/ThinkingBlock.js';
import { ToolBlock } from '../blocks/ToolBlock.js';
import { format } from '../../internal/time-functions.js';
import blank from '../../assets/images/blank-avatar.png?inline';
import { styles } from './MessageBox.styles.js';
import type { Message, MessageContent } from './MessageBox.types.js';

export class MessageBox extends BaseElement {
  static dependencies: Record<string, typeof BaseElement> = {
    'uc-copy-button': CopyButton,
    'uc-icon': Icon,
    'uc-text-block': TextBlock,
    'uc-markdown-block': MarkdownBlock,
    'uc-thinking-block': ThinkingBlock,
    'uc-tool-block': ToolBlock,
  };
  static styles = [ styles ];
  
  private observer: ResizeObserver = new ResizeObserver(this.updateFillHeight.bind(this));
  private lastCount: number = 0;

  @query('.container') containerEl!: HTMLDivElement;
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
      <div class="container">
        <div class="messages">
          ${repeat(this.messages, (msg) => msg.timestamp, (msg) => msg.role === 'user'
            ? html`
                <div class="user-msg">
                  <div class="msg-body">
                    ${msg.content && msg.content.length > 0
                      ? repeat(msg.content, (_, i) => i, (c) => {
                        return c.type === 'text'
                        ? html`<uc-text-block .value=${c.value}></uc-text-block>`
                        : nothing
                      })
                      : nothing}
                  </div>
                  <div class="msg-footer">
                    <uc-copy-button value=${this.getTextContent(msg.content)}></uc-copy-button>
                    <div class="timestamp">${format(msg.timestamp)}</div>
                  </div>
                </div>`
            : html`
                <div class="assistant-msg">
                  <img class="avatar" src=${msg.avatar || blank} alt="Avatar"/>
                  <div class="msg-main">
                    ${msg.name ? html`<div class="msg-header">${msg.name}</div>` : nothing}
                    <div class="msg-body">
                      ${msg.content && msg.content.length > 0
                        ? repeat(msg.content, (_, i) => i, (c, i) => {
                          const isLast = msg.content?.length === (i || 0) + 1;
                          return c.type === 'thinking'
                          ? html`<uc-thinking-block .value=${c.value} ?loading=${isLast}></uc-thinking-block>`
                          : c.type === 'text'
                          ? html`<uc-markdown-block .value=${c.value}></uc-markdown-block>`
                          : c.type === 'tool'
                          ? html`<uc-tool-block .value=${c} @tool-change=${(e: CustomEvent) => this.contentChanged(i, e)}></uc-tool-block>`
                          : nothing;
                        })
                        : nothing}
                    </div>
                    <div class="msg-footer">
                      <uc-copy-button value=${this.getTextContent(msg.content)}></uc-copy-button>
                      <div class="timestamp">${format(msg.timestamp)}</div>
                    </div>
                  </div>
                </div>`)}
        </div>
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
    if (!this.containerEl) return;
    requestAnimationFrame(() => {
      this.containerEl.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  /**
   * 현재 엘리먼트의 스크롤을 최하단으로 이동합니다.
   */
  public scrollToBottom = async () => {
    await this.updateComplete;
    if (!this.containerEl || this.containerEl.scrollHeight === 0) return;
    requestAnimationFrame(() => {
      this.containerEl.scrollTo({ top: this.containerEl.scrollHeight, behavior: 'smooth' });
    });
  }

  // 현재 엘리먼트의 높이를 계산하여 --host-height CSS 변수를 업데이트합니다.
  private updateFillHeight() {
    const hostHeight = this.getBoundingClientRect().height;
    const containerStyle = getComputedStyle(this.containerEl);
    const hostStyle = getComputedStyle(this);
    
    const paddingBottom = containerStyle.getPropertyValue('padding-bottom');
    const paddingTop = containerStyle.getPropertyValue('padding-top');
    const messageGap = hostStyle.getPropertyValue('--messages-gap');
    
    // 전체 높이 - 상단패딩 - 메시지 간격 - 하단패딩 = 채워야 할 높이
    const fillHeight = hostHeight
      - (parseFloat(paddingTop) ?? 0)
      - (parseFloat(messageGap) ?? 0)
      - (parseFloat(paddingBottom) ?? 0);
    this.style.setProperty('--fill-height', `${fillHeight}px`);
  }

  // 텍스트 블록의 내용만 반환합니다.
  private getTextContent = (content: MessageContent[] | undefined) => {
    if (!content) return '';
    let text = '';
    for (const c of content) {
      if (c.type === 'text') {
        text += c.value;
      }
    }
    return text;
  }

  private contentChanged = (idx: number, e: CustomEvent) => {
    const target = e.target;
    if (target instanceof ToolBlock) {
      const content = this.messages[this.messages.length - 1].content;
      if (!content || idx < 0 || idx >= content.length) return;
      content[idx] = target.value as MessageContent;
      this.dispatchEvent(new CustomEvent('tool-change', {
        detail: this.messages,
      }));
    }
  }
}
