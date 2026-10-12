import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import '@iyulab/components/dist/components/tooltip/UTooltip.js';
import '@iyulab/components/dist/components/icon/UIcon.js';
import { UElement } from '@iyulab/components/dist/components/UElement.js';
import '../../utilities/icons.js';
import { styles } from './URefTag.styles.js';
import { sanitizeHref } from '../../utilities/sanitizers.js';
import { messages } from '../../utilities/messages.js';
import { LinkActivationController } from '../../utilities/LinkActivation.js';

/**
 * 인용 태그 컴포넌트입니다.
 *
 * @event link-activate - 사람이 렌더된 링크를 활성화했다(클릭 · 가운데 클릭 · Enter). 취소 가능 — 막으면 브라우저 이동도 막힌다. detail: `LinkActivateEventDetail`
 */
@customElement('u-ref-tag')
export class URefTag extends UElement {
  /** 렌더된 링크를 누르면 `link-activate` 로 호스트에 묻는다(`LinkActivation`). */
  protected readonly linkActivation = new LinkActivationController(this);

  static styles = [ super.styles, styles ];

  /** 인용 출처 소스 데이터 */
  @property({ type: String }) href?: string;

  render() {
    return html`
      <a href="${ifDefined(this.href ? sanitizeHref(this.href) : undefined)}" target="_blank" rel="noopener noreferrer"
        @click=${this.handleAnchorClick}>
        <slot></slot>
        <span class="new-tab-hint">${messages.text('opensInNewTab')}</span>
      </a>

      <u-icon lib="internal-chat" name="external-link"></u-icon>

      <u-tooltip interactive placement="bottom" offset="4">
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