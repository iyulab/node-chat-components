import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import '@iyulab/components/dist/components/icon/UIcon.js';
import { arrayAttrConverter } from '@iyulab/components/dist/utilities/converters.js';
import { UDataElement } from '../UDataElement.js';
import '../../utilities/icons.js';
import { styles } from './URefCard.styles.js';
import { sanitizeHref } from '../../utilities/sanitizers.js';
import { messages } from '../../utilities/messages.js';

/**
 * 웹 참조 카드의 파비콘 이미지 URL 을 정한다. `undefined` 를 돌려주면 파비콘 없이 그린다.
 * @param url 카드의 `url`
 */
export type FaviconResolver = (url: string) => string | undefined;

/**
 * 구글 공개 파비콘 서비스를 쓰는 리졸버(opt-in). 카드마다 사이트의 호스트 이름을 구글에 보낸다 —
 * 공용 인터넷에 닿지 않는 망에서는 쓰지 말 것.
 *
 * @example URefCard.defaultFaviconUrl = googleFaviconUrl;
 */
export const googleFaviconUrl: FaviconResolver = (url) => {
  try {
    return `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(new URL(url).hostname)}`;
  } catch {
    return undefined;
  }
};

/**
 * 참조 소스를 카드 형태로 표시하는 공통 컴포넌트입니다.
 * Web과 Document 타입 모두 지원합니다.
 */
@customElement('u-ref-card')
export class URefCard extends UDataElement {
  static styles = [ super.styles, styles ];

  /**
   * 자기 `faviconUrl` 이 없는 모든 카드가 쓰는 리졸버. 기본값 `undefined` 는 파비콘을 요청하지 않는다 —
   * 카드가 밖으로 나가는 요청을 스스로 만들지 않는다. 카드가 그려지기 전에 정할 것.
   */
  static defaultFaviconUrl?: FaviconResolver;

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
  /** 이 카드의 파비콘 리졸버 — `URefCard.defaultFaviconUrl` 보다 우선한다. */
  @property({ attribute: false }) faviconUrl?: FaviconResolver;

  render() {
    return html`
      <a href="${ifDefined(this.url ? sanitizeHref(this.url) : undefined)}" target="_blank" rel="noopener noreferrer"
        @click=${this.handleAnchorClick}>
        <div class="header">
          ${this.renderFavicon()}
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
        <span class="new-tab-hint">${messages.text('opensInNewTab')}</span>
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

  /** 리졸버가 URL 을 돌려줄 때만 파비콘을 그린다(장식 — 제목이 이름을 나른다). */
  private renderFavicon() {
    const resolve = this.faviconUrl ?? URefCard.defaultFaviconUrl;
    const src = this.url && resolve ? resolve(this.url) : undefined;
    if (!src) return nothing;
    return html`<img class="favicon" src=${src} alt="" aria-hidden="true" />`;
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