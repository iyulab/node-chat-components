import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { UElement } from '@iyulab/components/dist/components/UElement.js';
import { styles } from './UMessage.styles.js';
import { messages } from '../../utilities/messages.js';

/** 메시지 variant 타입 */
export type MessageVariant = 'default' | 'bubble';
/** 메시지 위치 타입 */
export type MessagePosition = 'left' | 'right';
/** 메시지 너비 타입 */
export type MessageFit = 'full' | 'auto';
/** 메시지 발화자 타입 */
export type MessageAuthor = 'user' | 'assistant' | 'system';

/**
 * 채팅 메시지 컴포넌트입니다.
 * 슬롯을 통해 다양한 블록 컴포넌트를 자유롭게 배치할 수 있습니다.
 *
 * 발화자(`author`)는 위치(`position`)와 별개의 **의미**다 — 위치는 눈에만 보이므로, 보조기기는 본문 앞의 숨은
 * 이름(«AI assistant:»)으로 누가 말했는지 듣는다. 응답이 만들어지는 동안(`loading`) 본문은 `aria-busy` 다.
 */
@customElement('u-message')
export class UMessage extends UElement {
  static styles = [ super.styles, styles ];
  
  @property({ type: Boolean, reflect: true }) loading: boolean = false;
  @property({ type: String, reflect: true }) variant: MessageVariant = 'default';
  @property({ type: String, reflect: true }) position: MessagePosition = 'left';
  /**
   * 누가 말했는가 — 보조기기에 본문 앞에 읽힌다(«AI assistant:»), 화면에는 보이지 않는다. `header` 슬롯에 내용이
   * 있으면 그것이 보이는 이름이라 숨은 이름을 내지 않는다.
   */
  @property({ type: String, reflect: true }) author?: MessageAuthor;
  /** 발화자 이름을 바꾼다 — 기본은 로캘의 «You» · «AI assistant» · «System»(예: 어시스턴트의 제품 이름). */
  @property({ type: String, attribute: 'author-label' }) authorLabel?: string;

  /** `header` 슬롯이 보이는 이름을 갖고 있는가. */
  @state() private hasHeader = false;

  private get speaker(): string | undefined {
    if (!this.author || this.hasHeader) return undefined;
    if (this.authorLabel) return this.authorLabel;
    return messages.text(this.author === 'user' ? 'authorUser' : this.author === 'system' ? 'authorSystem' : 'authorAssistant');
  }

  private handleHeaderSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    this.hasHeader = slot.assignedNodes({ flatten: true })
      .some((n) => n.nodeType === Node.ELEMENT_NODE || !!n.textContent?.trim());
  };

  render() {
    return html`
      <slot name="header" @slotchange=${this.handleHeaderSlotChange}></slot>

      <div class="body" part="body" variant=${this.variant} position=${this.position}
        aria-busy=${this.loading ? 'true' : 'false'}>
        ${this.speaker ? html`<span class="visually-hidden">${messages.text('speakerPrefix', { name: this.speaker })}</span>` : nothing}
        <slot></slot>
        ${this.loading ? html`<span class="visually-hidden">${messages.text('generating')}</span>` : nothing}
        <svg class="dot-loader" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"
          ?hidden=${!this.loading}>
          <circle class="d0" cx="4" cy="12" r="3" />
          <circle class="d1" cx="12" cy="12" r="3" />
          <circle class="d2" cx="20" cy="12" r="3" />
        </svg>
      </div>

      <slot name="footer" ?hidden=${this.loading}></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "u-message": UMessage;
  }
}