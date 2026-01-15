import { html } from 'lit';
import { property, state } from 'lit/decorators.js';

import { BaseElement } from '@iyulab/components/dist/components/BaseElement.js';
import { UIcon } from '@iyulab/components/dist/components/icon/UIcon.component.js';
import { UButton } from '@iyulab/components/dist/components/button/UButton.component.js';
import { UTooltip } from '@iyulab/components/dist/components/tooltip/UTooltip.component.js';
import { styles } from './UCopyButton.styles.js';

/**
 * 클릭 시 클립보드에 텍스트를 복사하는 버튼입니다. 복사 상태를 표시하기 위해 아이콘이 변경됩니다.
 */
export class UCopyButton extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-icon': UIcon,
    'u-button': UButton,
    'u-tooltip': UTooltip
  };

  /** 클립보드 복사 상태를 나타내는 플래그입니다. */
  @state() isCopied: boolean = false;
  
  /** 클립보드 복사 후 재사용 대기 시간 (ms) */
  @property({ type: Number }) delay: number = 1_000;
  /** 복사할 텍스트를 설정합니다. */
  @property({ type: String }) value?: string;

  render() {
    return html`
      <u-button part="base" 
        variant="borderless"
        ?disabled=${this.isCopied}
        @click=${this.copyToClipboard}>
        <u-icon part="icon"
          lib="internal"
          name=${this.isCopied ? 'check-lg' : 'copy'}
        ></u-icon>
      </u-button>

      <u-tooltip for="u-button" placement="bottom" distance="8">
        <slot></slot>
      </u-tooltip>
    `;
  }

  /**
   * 클립보드에 텍스트를 복사하는 메서드입니다.
   * 복사 후 재사용 대기 시간이 설정되어 있으면, 일정 시간 후에 복사 가능 상태로 되돌립니다.
   */
  private copyToClipboard = async () => {
    if (!this.value) return;
    if (this.isCopied) return;

    try {
      await window.navigator.clipboard.writeText(this.value);
      if (this.delay <= 0) return;
    
      this.isCopied = true;

      setTimeout(() => {
        this.isCopied = false;
      }, this.delay);
    } catch (error) {
      console.error('Failed to copy text to clipboard:', error);
      this.isCopied = false;
    }
  }
}