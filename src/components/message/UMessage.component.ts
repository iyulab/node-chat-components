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
import type { BlockItem } from './UMessage.types.js';
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

  render() {
    return html`
      <slot name="header"></slot>
      
      <div class="body" part="body" variant=${this.variant} position=${this.position}>
        ${repeat(this.items || [], (_, idx) => idx, (item, idx) => 
            item.type === 'text' 
            ? html`
              <u-text-block
                .value=${item.value}
              ></u-text-block>`
            : item.type === 'markdown' 
            ? html`
              <u-marked-block
                .value=${item.value}
                .citations=${item.citations}
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
}
