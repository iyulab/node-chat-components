import { html } from 'lit';

import { BaseElement } from '@iyulab/components/dist/components/BaseElement.js';
import { UIcon } from '@iyulab/components/dist/components/icon/UIcon.component.js';
import { UButton } from '@iyulab/components/dist/components/button/UButton.component.js';
import { styles } from './UShareButton.styles.js';

/**
 * 메시지 공유하기 버튼 컴포넌트입니다.
 */
export class UShareButton extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-icon': UIcon,
    'u-button': UButton,
  };

  render() {
    return html`
      <u-button part="base" 
        variant="borderless">
        <u-icon part="icon"
          lib="internal"
          name="share"
        ></u-icon>
      </u-button>
    `;
  }
}
