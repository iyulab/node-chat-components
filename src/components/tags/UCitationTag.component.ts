import { html, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';

import { BaseElement } from '@iyulab/components/dist/components/BaseElement.js';
import { UIcon } from '@iyulab/components/dist/components/icon/UIcon.component.js';
import { UButton } from '@iyulab/components/dist/components/button/UButton.component.js';
import { UTooltip } from '@iyulab/components/dist/components/tooltip/UTooltip.component.js';
import { styles } from './UCitationTag.styles.js';

export interface Citation {
  /** 인용 출처 아이콘 (선택사항) */
  icon?: string;
  /** 인용 출처 타이틀 */
  title: string;
  /** 인용 출처 스니펫/내용 */
  snippet: string;
  /** 인용 출처 URL (선택사항) */
  url?: string;
}

/**
 * 인용 태그 컴포넌트입니다. 여러 개의 인용 정보를 표시하며, 툴팁으로 상세 정보를 제공합니다.
 */
export class UCitationTag extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-icon': UIcon,
    'u-button': UButton,
    'u-tooltip': UTooltip,
  };

  /** 인용 정보 배열 */
  @property({ type: Array }) citations: Citation[] = [];

  /** 현재 표시 중인 인용 인덱스 */
  @state() currentIndex: number = 0;

  connectedCallback(): void {
    super.connectedCallback();
    
    // data-citations 속성에서 citations 데이터 로드
    const dataCitations = this.getAttribute('data-citations');
    if (dataCitations) {
      try {
        this.citations = JSON.parse(dataCitations);
      } catch (error) {
        console.error('Failed to parse data-citations:', error);
      }
    }
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    
    // citations가 변경되면 인덱스를 0으로 리셋
    if (changedProperties.has('citations')) {
      this.currentIndex = 0;
    }
  }

  render() {
    if (!this.citations || this.citations.length === 0) {
      return html``;
    }

    const currentCitation = this.citations[this.currentIndex];
    const hasMultiple = this.citations.length > 1;
    const tagLabel = hasMultiple ? `+${this.currentIndex + 1}` : '';

    return html`
      <div part="base" class="citation-tag">
        <span part="label" id="citation-anchor-${this.currentIndex}">
          ${tagLabel}
        </span>
        
        <u-tooltip 
          part="tooltip"
          for="#citation-anchor-${this.currentIndex}"
          placement="top"
          interactive
        >
          <div part="tooltip-content" class="tooltip-content">
            ${hasMultiple ? html`
              <div part="tooltip-header" class="tooltip-header">
                <u-button
                  part="prev-button"
                  size="small"
                  ?disabled=${this.currentIndex === 0}
                  @click=${this.handlePrevious}
                >
                  <u-icon lib="internal" name="chevron-left"></u-icon>
                </u-button>
                
                <span part="pagination" class="pagination">
                  ${this.currentIndex + 1}/${this.citations.length}
                </span>
                
                <u-button
                  part="next-button"
                  size="small"
                  ?disabled=${this.currentIndex === this.citations.length - 1}
                  @click=${this.handleNext}
                >
                  <u-icon lib="internal" name="chevron-right"></u-icon>
                </u-button>
              </div>
            ` : ''}
            
            <div part="tooltip-body" class="tooltip-body">
              ${currentCitation.icon ? html`
                <u-icon 
                  part="citation-icon" 
                  class="citation-icon"
                  lib="internal" 
                  name=${currentCitation.icon}
                ></u-icon>
              ` : ''}
              
              <div part="citation-content" class="citation-content">
                <div part="citation-title" class="citation-title">
                  ${currentCitation.url ? html`
                    <a href=${currentCitation.url} target="_blank" rel="noopener noreferrer">
                      ${currentCitation.title}
                    </a>
                  ` : currentCitation.title}
                </div>
                
                <div part="citation-snippet" class="citation-snippet">
                  ${currentCitation.snippet}
                </div>
              </div>
            </div>
          </div>
        </u-tooltip>
      </div>
    `;
  }

  private handlePrevious = () => {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  private handleNext = () => {
    if (this.currentIndex < this.citations.length - 1) {
      this.currentIndex++;
    }
  }
}
