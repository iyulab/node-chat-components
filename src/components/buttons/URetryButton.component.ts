import { html } from 'lit';
import { property } from 'lit/decorators.js';

import { UElement } from '@iyulab/components/dist/components/UElement.js';
import { UIcon } from '@iyulab/components/dist/components/icon/UIcon.component.js';
import { UButton } from '@iyulab/components/dist/components/button/UButton.component.js';
import { UTooltip } from '@iyulab/components/dist/components/tooltip/UTooltip.component.js';
import { styles } from './URetryButton.styles.js';

/**
 * 메시지 재시도 버튼 컴포넌트입니다.
 */
export class URetryButton extends UElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof UElement> = {
    'u-icon': UIcon,
    'u-button': UButton,
    'u-tooltip': UTooltip
  };

  /** 재생성 중인지 여부 */
  @property({ type: Boolean, reflect: true }) loading: boolean = false;

  render() {
    return html`
      <u-button part="base" variant="ghost">
        <u-icon part="icon"
          lib="internal"
          name="arrow-repeat"
        ></u-icon>
      </u-button>

      <u-tooltip for="u-button" placement="bottom" distance="8">
        <slot></slot>
      </u-tooltip>
    `;
  }
}
