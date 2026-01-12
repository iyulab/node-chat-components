import { html } from 'lit';
import { property } from 'lit/decorators.js';

import { BaseElement } from '@iyulab/components/dist/components/BaseElement.js';
import { UIcon } from '@iyulab/components/dist/components/icon/UIcon.component.js';
import type { CitationSource } from '../message/UMessage.types.js';
import { styles } from './UCitationTag.styles.js';

/**
 * Citation을 표시하는 태그 컴포넌트입니다.
 * 클릭 시 citation 상세 정보를 표시합니다.
 */
export class UCitationTag extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-icon': UIcon,
  };

  /** Citation 번호 (1-based) */
  @property({ type: Number }) index?: number;
  /** Citation 출처 정보 */
  @property({ type: Object }) source?: CitationSource;
  /** 확장 여부 */
  @property({ type: Boolean, reflect: true }) expanded: boolean = false;

  render() {
    if (!this.index || !this.source) return html``;

    return html`
      <button
        class="tag"
        part="tag"
        @click=${this.handleToggle}
        aria-expanded=${this.expanded}
      >
        <span class="index">[${this.index}]</span>
        ${this.expanded ? html`
          <u-icon lib="internal" name="chevron-up"></u-icon>
        ` : html`
          <u-icon lib="internal" name="chevron-down"></u-icon>
        `}
      </button>
      ${this.expanded ? this.renderCitationDetail() : ''}
    `;
  }

  private renderCitationDetail() {
    if (!this.source) return '';

    const { type } = this.source;

    return html`
      <div class="detail" part="detail">
        <div class="detail-header">
          ${this.renderIcon(type)}
          <span class="detail-title">${this.getTitle()}</span>
        </div>
        ${this.source.snippet ? html`
          <div class="detail-snippet">${this.source.snippet}</div>
        ` : ''}
        <div class="detail-meta">
          ${this.renderMeta()}
        </div>
      </div>
    `;
  }

  private renderIcon(type: string) {
    const iconMap: Record<string, string> = {
      'web': 'globe',
      'document': 'file-earmark-text',
    };
    return html`<u-icon lib="internal" name=${iconMap[type] || 'file-earmark'}></u-icon>`;
  }

  private getTitle(): string {
    if (!this.source) return '';
    
    switch (this.source.type) {
      case 'web':
      case 'document':
        return this.source.title;
      default:
        return '';
    }
  }

  private renderMeta() {
    if (!this.source) return '';

    switch (this.source.type) {
      case 'web':
        return html`
          <a href=${this.source.url} target="_blank" rel="noopener noreferrer" class="detail-link">
            ${this.truncateUrl(this.source.url)}
          </a>
          ${this.source.accessedAt ? html`
            <span class="detail-date">• ${this.formatDate(this.source.accessedAt)}</span>
          ` : ''}
        `;
      case 'document':
        return html`
          ${this.source.fileName ? html`<span>${this.source.fileName}</span>` : ''}
          ${this.source.pageNumber ? html`<span>• Page ${this.source.pageNumber}</span>` : ''}
          ${this.source.author ? html`<span>• ${this.source.author}</span>` : ''}
        `;
      default:
        return '';
    }
  }

  private truncateUrl(url: string, maxLength: number = 50): string {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength - 3) + '...';
  }

  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  }

  private handleToggle = () => {
    this.expanded = !this.expanded;
  }
}
