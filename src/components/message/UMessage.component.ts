import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { BaseElement } from '@iyulab/components/dist/components/BaseElement.js';
import { UTextBlock } from '../blocks/UTextBlock.component.js';
import { UMarkedBlock } from '../blocks/UMarkedBlock.component.js';
import { UThinkBlock } from '../blocks/UThinkBlock.component.js';
import { UToolBlock } from '../blocks/UToolBlock.component.js';
import { UDotLoader } from '../loaders/UDotLoader.component.js';
import { UCitationTag } from '../tags/UCitationTag.component.js';
import type { BlockItem, CitationSource, CitationReference } from './UMessage.types.js';
import type { Citation } from '../tags/UCitationTag.component.js';
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
    'u-dot-loader': UDotLoader,
    'u-citation-tag': UCitationTag,
  };

  @property({ type: String, reflect: true }) variant: MessageVariant = 'default';  
  @property({ type: String, reflect: true }) position: MessagePosition = 'left';  
  @property({ type: Boolean, reflect: true }) loading: boolean = false;
  @property({ type: Array }) items?: BlockItem[];
  @property({ type: Array }) citations?: CitationSource[];

  render() {
    return html`
      <slot name="header"></slot>
      
      <div class="body" part="body" variant=${this.variant} position=${this.position}>
        ${repeat(this.items || [], (_, idx) => idx, (item, idx) => 
            item.type === 'text' 
            ? html`
              <u-text-block
                .value=${this.insertTags(item.value, item.refs)}
              ></u-text-block>`
            : item.type === 'markdown' 
            ? html`
              <u-marked-block
                .value=${this.insertTags(item.value, item.refs)}
              ></u-marked-block>`
            : item.type === 'thinking'
            ? html`
              <u-think-block 
                ?loading=${this.items?.length === ((idx || 0) + 1)}
                .value=${item.value}
              ></u-think-block>`
            : item.type === 'tool' 
            ? html`
              <u-tool-block
                .index=${idx}
                .heading=${item.title}
                .input=${item.input}
                .output=${item.output}
              ></u-tool-block>`
            : nothing)}
        <u-dot-loader
          ?hidden=${!this.loading}
        ></u-dot-loader>
      </div>

      <slot name="footer"></slot>
    `;
  }

  /**
   * 문자열에 citation 태그 컴포넌트를 삽입합니다.
   */
  private insertTags = (text?: string, refs?: CitationReference[]): string => {
    if (!text || !refs || refs.length === 0) return text || '';
    
    // citation을 위치별로 정렬
    const sortedRefs = [...refs].sort((a, b) => a.startIndex - b.startIndex);
    
    // citation ID별로 그룹화
    const citationGroups = new Map<number, CitationReference[]>();
    sortedRefs.forEach(ref => {
      if (!citationGroups.has(ref.citationId)) {
        citationGroups.set(ref.citationId, []);
      }
      citationGroups.get(ref.citationId)!.push(ref);
    });
    
    // 각 위치에 citation 태그 삽입
    let result = '';
    let lastIndex = 0;
    
    for (const [citationId, group] of citationGroups) {
      const firstRef = group[0];
      
      // 이전 위치부터 현재 citation까지의 텍스트 추가
      result += text.substring(lastIndex, firstRef.endIndex);
      
      // citation 데이터 생성
      const citations = this.getCitationsForGroup([citationId]);
      if (citations.length > 0) {
        // lit-html로 렌더링하기 위해 placeholder 사용
        result += `<u-citation-tag data-citations='${JSON.stringify(citations)}'></u-citation-tag>`;
      }
      
      lastIndex = firstRef.endIndex;
    }
    
    // 나머지 텍스트 추가
    result += text.substring(lastIndex);
    
    return result;
  }
  
  /**
   * citation ID들로부터 Citation 객체 배열을 생성합니다.
   */
  private getCitationsForGroup = (citationIds: number[]): Citation[] => {
    if (!this.citations) return [];
    
    return citationIds
      .map(id => {
        const source = this.citations![id];
        if (!source) return null;
        
        const citation: Citation = {
          title: source.title,
          snippet: source.snippet || '',
        };
        
        if (source.type === 'web') {
          citation.url = source.url;
          citation.icon = 'globe';
        } else if (source.type === 'document') {
          citation.icon = 'file-text';
        }
        
        return citation;
      })
      .filter((c): c is Citation => c !== null);
  }
}
