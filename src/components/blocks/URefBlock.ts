import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '../references/URefCard.js';
import { UElement } from '@iyulab/components/dist/components/UElement.js';
import type { ReferenceSource } from '../../types/References.js';
import { styles } from './URefBlock.styles.js';
import { repeat } from 'lit/directives/repeat.js';

/**
 * 레퍼런스 정보를 블록 형태로 표시하는 컴포넌트입니다.
 * 단일 또는 다중 레퍼런스 카드를 그리드 레이아웃으로 표시합니다.
 */
@customElement('u-ref-block')
export class URefBlock extends UElement {
  static styles = [ super.styles, styles ];

  /** 접힘 상태 @default: true */
  @property({ type: Boolean, reflect: true }) collapsed: boolean = true;
  /** 블록 제목 */
  @property({ type: String }) title: string = '';
  /** 출처 목록 */
  @property({ type: Array }) sources?: ReferenceSource[];

  render() {
    return html`
      <button class="header" @click=${() => this.collapsed = !this.collapsed}>
        <u-icon
          ?collapsed=${this.collapsed}
          lib="internal" 
          name="chevron-down"
        ></u-icon>
        <div class="title">
          ${this.title || 'References'}
        </div>
        <div style="flex: 1;"></div>
        <div class="count">
          ${this.sources ? this.sources.length : 0}
        </div>
      </button>

      <div class="body" ?collapsed=${this.collapsed}>
        ${repeat(this.sources || [], (_, idx) => idx, (source) => {
          return html`
            <u-ref-card
              .type=${source.type}
              .url=${source.url}
              .title=${source.title || ''}
              .snippet=${source.snippet || ''}
              .tags=${source.tags}
            ></u-ref-card>
          `;
        })}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "u-ref-block": URefBlock;
  }
}