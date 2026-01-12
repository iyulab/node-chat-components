import { html } from 'lit';
import { property } from 'lit/decorators.js';

import { BaseElement } from '@iyulab/components/dist/components/BaseElement.js';
import { UIcon } from '@iyulab/components/dist/components/icon/UIcon.component.js';
import { UButton } from '@iyulab/components/dist/components/button/UButton.component.js';
import { styles } from './URetryButton.styles.js';

/**
 * 메시지 재시도 버튼 컴포넌트입니다.
 */
export class URetryButton extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-icon': UIcon,
    'u-button': UButton,
  };

  /** 재생성 중인지 여부 */
  @property({ type: Boolean, reflect: true }) loading: boolean = false;

  render() {
    return html`
      <u-button part="base" 
        variant="borderless">
        <u-icon part="icon"
          lib="internal"
          name="arrow-clockwise"
        ></u-icon>
      </u-button>
    `;
  }
}
