import { html } from 'lit';
import { property } from 'lit/decorators.js';

import { BaseElement } from '@iyulab/components/dist/components/BaseElement.js';
import { UTooltip } from '@iyulab/components/dist/components/tooltip/UTooltip.component.js';
import { UIcon } from '@iyulab/components/dist/components/icon/UIcon.component.js';
import { styles } from './URefTag.styles.js';

/**
 * 인용 태그 컴포넌트입니다.
 */
export class URefTag extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-icon': UIcon,
    'u-tooltip': UTooltip
  };

  /** 인용 출처 소스 데이터 */
  @property({ type: String }) href: string = '#';

  render() {
    return html`
      <a href="${this.href}" target="_blank" rel="noopener noreferrer">
        <slot></slot>
      </a>

      <u-icon lib="internal" name="box-arrow-up-right"></u-icon>

      <u-tooltip interactive placement="bottom" distance="4">
        <slot name="tooltip"></slot>
      </u-tooltip>
    `;
  }
}
