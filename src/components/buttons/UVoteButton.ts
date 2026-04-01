import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@iyulab/components/dist/components/icon/UIcon.js';
import '@iyulab/components/dist/components/button/UButton.js';
import '@iyulab/components/dist/components/tooltip/UTooltip.js';
import { UElement } from '@iyulab/components/dist/components/UElement.js';
import { styles } from './UVoteButton.styles.js';

/** 투표 상태 타입 */
export type VoteValue = 'none' | 'up' | 'down';

/**
 * 투표 버튼 컴포넌트입니다.
 */
@customElement('u-vote-button')
export class UVoteButton extends UElement {
  static styles = [ super.styles, styles ];

  /** 현재 투표 상태 */
  @property({ type: String }) value: VoteValue = 'none';

  render() {
    return html`
      <u-button class="up-btn" part="up-btn"
        variant="ghost"
        @click=${this.handleUpButtonClick}>
        <u-icon part="icon"
          lib="bootstrap"
          name=${this.value === 'up' ? 'hand-thumbs-up-fill' : 'hand-thumbs-up'}
        ></u-icon>
      </u-button>
      <u-button class="down-btn" part="down-btn"
        variant="ghost"
        @click=${this.handleDownButtonClick}>
        <u-icon part="icon"
          lib="bootstrap"
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
    this.dispatchEvent(new Event('change', { 
      bubbles: true, 
      composed: true 
    }));
  }

  private handleDownButtonClick = () => {
    this.value = this.value === 'down' ? 'none' : 'down';
    this.dispatchEvent(new Event('change', { 
      bubbles: true, 
      composed: true 
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-vote-button': UVoteButton;
  }
}