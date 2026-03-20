import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { UElement } from '@iyulab/components/dist/components/UElement.js';
import { UTooltip } from '@iyulab/components/dist/components/tooltip/UTooltip.component.js';
import { UIcon } from '@iyulab/components/dist/components/icon/UIcon.component.js';
import { styles } from './URefTag.styles.js';

/**
 * 인용 태그 컴포넌트입니다.
 */
export class URefTag extends UElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof UElement> = {
    'u-icon': UIcon,
    'u-tooltip': UTooltip
  };

  /** 인용 출처 소스 데이터 */
  @property({ type: String }) href?: string;

  render() {
    return html`
      <a href="${ifDefined(this.href)}" target="_blank" rel="noopener noreferrer"
        @click=${this.handleAnchorClick}>
        <slot></slot>
      </a>

      <u-icon lib="bootstrap" name="box-arrow-up-right"></u-icon>

      <u-tooltip interactive placement="bottom" distance="4">
        <slot name="tooltip"></slot>
      </u-tooltip>
    `;
  }

  /** 링크 클릭 핸들러 */
  private handleAnchorClick(e: Event) {
    // 기본 동작 방지: href가 없을 때
    if (!this.href) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
}
