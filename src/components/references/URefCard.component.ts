import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { arrayAttrConverter } from '@iyulab/components/dist/utilities/converters.js';
import { BaseElement } from '@iyulab/components/dist/components/BaseElement.js';
import { UIcon } from '@iyulab/components/dist/components/icon/UIcon.component.js';
import { styles } from './URefCard.styles.js';

/**
 * 참조 소스를 카드 형태로 표시하는 공통 컴포넌트입니다.
 * Web과 Document 타입 모두 지원합니다.
 */
export class URefCard extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-icon': UIcon,
  };

  /** 카드 타입 (web 또는 document) */
  @property({ type: String, reflect: true }) type: 'web' | 'document' = 'web';
  /** 외부 링크 URL */
  @property({ type: String }) href?: string;
  /** 카드 타이틀 */
  @property({ type: String }) heading?: string;
  /** 태그 목록 */
  @property({ type: Array, converter: arrayAttrConverter(v => v) }) tags?: string[];

  render() {
    return html`
      <a href="${ifDefined(this.href)}" target="_blank" rel="noopener noreferrer"
        @click=${this.handleAnchorClick}>
        <div class="header">
          <img class="favicon" 
            src="${this.getFaviconUrl(this.href)}" 
            alt="favicon"
          />
          <div class="title" title="${ifDefined(this.heading)}">
            ${this.heading || this.getDomainName(this.href)}
          </div>

          <div style="flex: 1;"></div>

          <div class="badge" type=${this.type}>
            <u-icon 
              lib="internal" 
              name=${this.type === 'web' ? 'globe' : 'file-earmark'}
            ></u-icon>
            ${this.type.toUpperCase()}
          </div>
        </div>

        <div class="body">
          <slot></slot>
        </div>
        
        <div class="footer" ?hidden=${!this.tags || this.tags.length === 0}>
          ${this.tags?.map(tag => html`<span class="tag">${tag}</span>`)}
        </div>
      </a>
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

  /** URL에서 Google의 파비콘 URL을 반환합니다. */
  private getFaviconUrl(url?: string): string {
    if (!url) return `/favicon.ico`;

    try {
      const hostname = new URL(url).hostname;
      // Google Favicon API (64px);
      return `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;
    } catch {
      return `/favicon.ico`
    }
  }

  /** URL에서 도메인 사이트 주소를 반환합니다. */
  private getDomainName(url?: string): string {
    if (!url) return "";

    try {
      return new URL(url).hostname;
    } catch {
      return ""
    }
  }
}
