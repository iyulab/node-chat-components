import { html } from 'lit';
import { property } from 'lit/decorators.js';

import { BaseElement } from '@iyulab/components/dist/components/BaseElement.js';
import { styles } from './UMessage.styles.js';

/** 메시지 variant 타입 */
export type MessageVariant = 'default' | 'bubble';
/** 메시지 위치 타입 */
export type MessagePosition = 'left' | 'right';

/**
 * 채팅 메시지 컴포넌트입니다.
 * 슬롯을 통해 다양한 블록 컴포넌트를 자유롭게 배치할 수 있습니다.
 */
export class UMessage extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {};

  @property({ type: String, reflect: true }) variant: MessageVariant = 'default';
  @property({ type: String, reflect: true }) position: MessagePosition = 'left';
  @property({ type: Boolean, reflect: true }) loading: boolean = false;

  render() {
    return html`
      <slot name="header"></slot>

      <div class="body" part="body" variant=${this.variant} position=${this.position}>
        <slot></slot>
        <svg class="dot-loader" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
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
