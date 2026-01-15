import { html } from 'lit';
import { property } from 'lit/decorators.js';

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
  /** 이미지 URL (예: favicon) */
  @property({ type: String }) image?: string;
  /** 카드 헤딩 (타이틀) */
  @property({ type: String }) heading?: string;
  /** 외부 링크 URL */
  @property({ type: String }) href?: string;
  /** 태그 목록 */
  @property({ type: Array }) tags?: string[];

  render() {;
    const iconColor = this.type === 'web' ? 'blue' : 'green';
    
    return html`
      <div class="card">
        <div class="card-header">
          <div class="card-icon ${iconColor}">
            ${this.image 
              ? html`<img src="${this.image}" alt="icon" class="image" />` 
              : html`<u-icon lib="internal" name="${this.type === 'web' ? 'globe' : 'file-earmark'}"></u-icon>`}
          </div>
          
          <a href="${this.href || "#"}" target="_blank" rel="noopener noreferrer" class="type-badge-link ${this.type}">
            <span class="badge-text">${this.type === 'web' ? 'WEB' : 'DOCUMENT'}</span>
            <u-icon lib="internal" name="box-arrow-up-right"></u-icon>
          </a>
        </div>
        
        <div class="card-content">
          <h4 class="heading" ?hidden=${!this.heading}>
            ${this.heading}
          </h4>
          
          <div class="snippet">
            <slot></slot>
          </div>
          
          <div class="tags" ?hidden=${!this.tags || this.tags.length === 0}>
            ${this.tags?.map(tag => html`<span class="tag">${tag}</span>`)}
          </div>
        </div>
      </div>
    `;
  }
}
