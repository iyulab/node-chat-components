import { html } from 'lit';

import { BaseElement } from '@iyulab/components/dist/components/BaseElement.js';
import { UIcon } from '@iyulab/components/dist/components/icon/UIcon.component.js';
import { UButton } from '@iyulab/components/dist/components/button/UButton.component.js';
import { UTooltip } from '@iyulab/components/dist/components/tooltip/UTooltip.component.js';
import { styles } from './UReportButton.styles.js';

/**
 * 메시지 신고 버튼 컴포넌트입니다.
 */
export class UReportButton extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-icon': UIcon,
    'u-button': UButton,
    'u-tooltip': UTooltip
  };

  render() {
    return html`
      <u-button part="base" 
        variant="borderless">
        <u-icon part="icon"
          lib="internal"
          name="flag"
        ></u-icon>
      </u-button>

      <u-tooltip for="u-button" placement="bottom" distance="8">
        <slot></slot>
      </u-tooltip>
    `;
  }
}
