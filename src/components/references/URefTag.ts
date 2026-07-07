import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import '@iyulab/components/dist/components/tooltip/UTooltip.js';
import '@iyulab/components/dist/components/icon/UIcon.js';
import { UElement } from '@iyulab/components/dist/components/UElement.js';
import '../../utilities/icons.js';
import { styles } from './URefTag.styles.js';

/**
 * 인용 태그 컴포넌트입니다.
 */
@customElement('u-ref-tag')
export class URefTag extends UElement {
  static styles = [ super.styles, styles ];

  /** 인용 출처 소스 데이터 */
  @property({ type: String }) href?: string;

  render() {
    return html`
      <a href="${ifDefined(this.href)}" target="_blank" rel="noopener noreferrer"
        @click=${this.handleAnchorClick}>
        <slot></slot>
      </a>

      <u-icon lib="internal-chat" name="external-link"></u-icon>

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

declare global {
  interface HTMLElementTagNameMap {
    'u-ref-tag': URefTag;
  }
}