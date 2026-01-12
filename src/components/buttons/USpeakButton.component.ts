import { html } from 'lit';
import { property } from 'lit/decorators.js';

import { BaseElement } from '@iyulab/components/dist/components/BaseElement.js';
import { UIcon } from '@iyulab/components/dist/components/icon/UIcon.component.js';
import { UButton } from '@iyulab/components/dist/components/button/UButton.component.js';
import { styles } from './USpeakButton.styles.js';

/**
 * 텍스트를 음성으로 읽어주는 버튼 컴포넌트입니다.
 */
export class USpeakButton extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-icon': UIcon,
    'u-button': UButton,
  };

  /** 현재 재생 중인지 여부 */
  @property({ type: Boolean, reflect: true }) loading: boolean = false;

  render() {
    return html`
      <u-button part="base" 
        variant="borderless">
        <u-icon part="icon"
          lib="internal"
          name=${this.loading ? 'stop-circle' : 'volume-up'}
        ></u-icon>
      </u-button>
    `;
  }
}
