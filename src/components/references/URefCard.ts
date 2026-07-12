import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import '@iyulab/components/dist/components/icon/UIcon.js';
import { arrayAttrConverter } from '@iyulab/components/dist/utilities/converters.js';
import { UDataElement } from '../UDataElement.js';
import '../../utilities/icons.js';
import { styles } from './URefCard.styles.js';

/**
 * 참조 소스를 카드 형태로 표시하는 공통 컴포넌트입니다.
 * Web과 Document 타입 모두 지원합니다.
 */
@customElement('u-ref-card')
export class URefCard extends UDataElement {
  static styles = [ super.styles, styles ];

  /** 카드 타입 (web 또는 document) */
  @property({ type: String, reflect: true }) type: 'web' | 'document' = 'web';
  /** 외부 링크 URL */
  @property({ type: String }) url?: string;
  /** 카드 타이틀 */
  @property({ type: String }) title: string = '';
  /** 카드 본문 스니펫 */
  @property({ type: String }) snippet?: string;
  /** 태그 목록 */
  @property({ type: Array, converter: arrayAttrConverter(v => v) }) tags?: string[];

  render() {
    return html`
      <a href="${ifDefined(this.url)}" target="_blank" rel="noopener noreferrer"
        @click=${this.handleAnchorClick}>
        <div class="header">
          <img class="favicon" 
            src="${this.getFaviconUrl(this.url)}" 
            alt="favicon"
          />
          <div class="title">
            ${this.title || this.getDomainName(this.url)}
          </div>

          <div style="flex: 1;"></div>

          <div class="badge" type=${this.type}>
            <u-icon
              lib="internal-chat"
              name=${this.type === 'web' ? 'world' : 'file'}
            ></u-icon>
            ${this.type.toUpperCase()}
          </div>
        </div>

        <div class="body">
          ${this.snippet}
        </div>
        
        <div class="footer" ?hidden=${!this.tags || this.tags.length === 0}>
          ${this.tags?.map(tag => html`<span class="tag">${tag}</span>`)}
        </div>
      </a>
    `;
  }

  /**
   * script-payload(UMarkedBlock 툴팁)와 property 바인딩(URefBlock) 두 사용
   * 패턴을 모두 지원합니다. script 자식이 없으면 property 기반 렌더로
   * 간주하고 조용히 건너뜁니다.
   */
  protected async load(data?: object): Promise<void> {
    if (!data && !this.querySelector('script[type="application/json"]')) return;
    return super.load(data);
  }

  /** 링크 클릭 핸들러 */
  private handleAnchorClick(e: Event) {
    // 기본 동작 방지: href가 없을 때
    if (!this.url) {
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

declare global {
  interface HTMLElementTagNameMap {
    "u-ref-card": URefCard;
  }
}