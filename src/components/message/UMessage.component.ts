import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { BaseElement } from '@iyulab/components/dist/components/BaseElement.js';
import { UTextBlock } from '../blocks/UTextBlock.component.js';
import { UMarkedBlock } from '../blocks/UMarkedBlock.component.js';
import { UThinkBlock } from '../blocks/UThinkBlock.component.js';
import { UToolBlock } from '../blocks/UToolBlock.component.js';
import { UCitationTag } from '../tags/UCitationTag.component.js';
import type { BlockItem, CitationSource } from './UMessage.types.js';
import { styles } from './UMessage.styles.js';

/** 메시지 variant 타입 */
export type MessageVariant = 'default' | 'bubble';
/** 메시지 위치 타입 */
export type MessagePosition = 'left' | 'right';

/**
 * 채팅 메시지 컴포넌트입니다.
 * 다양한 유형의 블록 아이템과 인용 출처를 렌더링할 수 있습니다.
 */
export class UMessage extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-text-block': UTextBlock,
    'u-marked-block': UMarkedBlock,
    'u-think-block': UThinkBlock,
    'u-tool-block': UToolBlock,
    'u-citation-tag': UCitationTag
  };

  @property({ type: String, reflect: true }) variant?: MessageVariant = 'default';  
  @property({ type: String, reflect: true }) position?: MessagePosition = 'left';  
  @property({ type: Array }) items?: BlockItem[];
  @property({ type: Array }) citations?: CitationSource[];

  render() {
    return html`
      <div class="container variant-${this.variant} position-${this.position}">
        <div class="header" part="header">
          <slot name="header"></slot>
        </div>
        <div class="body" part="body">
          ${this.items && this.items.length > 0
            ? repeat(this.items, (_, idx) => idx, (item, idx) => {
                return item.type === 'text' ? html`
                  ${this.renderTextWithCitations(item.value, item.citationRefs)}`
                : item.type === 'markdown' ? html`
                  ${this.renderMarkdownWithCitations(item.value, item.citationRefs)}`
                : item.type === 'thinking' ? html`
                  <u-think-block 
                    ?loading=${this.items?.length === ((idx || 0) + 1)}
                    .value=${item.value}
                  ></u-think-block>`
                : item.type === 'tool' ? html`
                  <u-tool-block
                    .index=${idx}
                    .status=${item.status}
                    .name=${item.name}
                    .input=${item.input}
                    .output=${item.output}
                  ></u-tool-block>`
                : nothing})
            : html`
              <svg class="loader" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <circle class="dot" cx="4" cy="12" r="3"/>
                  <circle class="dot d1" cx="12" cy="12" r="3"/>
                  <circle class="dot d2" cx="20" cy="12" r="3"/>
              </svg>`}
        </div>
        <div class="footer" part="footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }

  /**
   * 텍스트 블록을 citationRefs와 함께 렌더링합니다.
   */
  private renderTextWithCitations = (value?: string, refs?: any[]) => {
    if (!value) return html`<u-text-block .value=${value}></u-text-block>`;
    if (!refs || refs.length === 0) return html`<u-text-block .value=${value}></u-text-block>`;

    const parts = this.insertCitationTags(value, refs);
    return html`<u-text-block>${parts}</u-text-block>`;
  }

  /**
   * 마크다운 블록을 citationRefs와 함께 렌더링합니다.
   */
  private renderMarkdownWithCitations = (value?: string, refs?: any[]) => {
    if (!value) return html`<u-marked-block .value=${value}></u-marked-block>`;
    if (!refs || refs.length === 0) return html`<u-marked-block .value=${value}></u-marked-block>`;

    const parts = this.insertCitationTags(value, refs);
    return html`<u-marked-block .value=${value}></u-marked-block>${parts.filter((p: any) => typeof p !== 'string')}`;
  }

  /**
   * 문자열에 citation 태그를 삽입합니다.
   */
  private insertCitationTags = (text: string, refs: any[]): any[] => {
    if (!this.citations || this.citations.length === 0) return [text];

    // endIndex 기준으로 정렬 (뒤에서부터 삽입하기 위해 역순)
    const sortedRefs = [...refs].sort((a, b) => b.endIndex - a.endIndex);
    
    const result: any[] = [];
    let lastIndex = text.length;

    // 뒤에서부터 처리
    for (const ref of sortedRefs) {
      const { citationId, endIndex } = ref;
      const citation = this.citations[citationId];
      
      if (!citation) continue;

      // endIndex 이후 텍스트
      if (endIndex < lastIndex) {
        result.unshift(text.substring(endIndex, lastIndex));
      }

      // citation 태그 삽입
      result.unshift(html`<u-citation-tag
        .index=${citationId + 1}
        .source=${citation}
      ></u-citation-tag>`);

      lastIndex = endIndex;
    }

    // 맨 앞 텍스트
    if (lastIndex > 0) {
      result.unshift(text.substring(0, lastIndex));
    }

    return result;
  }
}
