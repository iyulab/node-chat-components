import { html } from 'lit';
import { property } from 'lit/decorators.js';

import { UElement } from '@iyulab/components/dist/components/UElement.js';
import { UIcon } from '@iyulab/components/dist/components/icon/UIcon.component.js';
import { UButton } from '@iyulab/components/dist/components/button/UButton.component.js';
import { UTooltip } from '@iyulab/components/dist/components/tooltip/UTooltip.component.js';
import { styles } from './UVoteButton.styles.js';

/** 투표 상태 타입 */
export type VoteValue = 'none' | 'up' | 'down';

/**
 * 투표 버튼 컴포넌트입니다.
 */
export class UVoteButton extends UElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof UElement> = {
    'u-icon': UIcon,
    'u-button': UButton,
    'u-tooltip': UTooltip
  };

  /** 현재 투표 상태 */
  @property({ type: String }) value: VoteValue = 'none';

  render() {
    return html`
      <u-button class="up-btn" part="up-btn"
        variant="borderless"
        @click=${this.handleUpButtonClick}>
        <u-icon part="icon"
          lib="internal"
          name=${this.value === 'up' ? 'hand-thumbs-up-fill' : 'hand-thumbs-up'}
        ></u-icon>
      </u-button>
      <u-button class="down-btn" part="down-btn"
        variant="borderless"
        @click=${this.handleDownButtonClick}>
        <u-icon part="icon"
          lib="internal"
          name=${this.value === 'down' ? 'hand-thumbs-down-fill' : 'hand-thumbs-down'}
        ></u-icon>
      </u-button>

      <u-tooltip for=".up-btn" placement="bottom" distance="8">
        <slot name="up"></slot>
      </u-tooltip>
      <u-tooltip for=".down-btn" placement="bottom" distance="8">
        <slot name="down"></slot>
      </u-tooltip>
    `;
  }

  private handleUpButtonClick = () => {
    this.value = this.value === 'up' ? 'none' : 'up';
    this.emit('u-change', { value: this.value });
  }

  private handleDownButtonClick = () => {
    this.value = this.value === 'down' ? 'none' : 'down';
    this.emit('u-change', { value: this.value });
  }
}