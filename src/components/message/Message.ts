import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { BaseElement } from '../../internal/BaseElement.js';
import { CopyButton } from '../buttons/CopyButton.js';
import { TextBlock } from '../blocks/TextBlock.js';
import { MarkdownBlock } from '../blocks/MarkdownBlock.js';
import { ThinkingBlock } from '../blocks/ThinkingBlock.js';
import { ToolBlock } from '../blocks/ToolBlock.js';
import { DotBounceLoader } from '../loaders/DotBounceLoader.js';
import type { BlockItem } from './Message.types.js';
import { format } from '../../utilities/time-functions.js';
import { styles } from './Message.styles.js';

export class Message extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'uc-text-block': TextBlock,
    'uc-markdown-block': MarkdownBlock,
    'uc-thinking-block': ThinkingBlock,
    'uc-tool-block': ToolBlock,
    'uc-copy-button': CopyButton,
    'uc-dot-bounce-loader': DotBounceLoader
  };

  @property({ type: Array }) items?: BlockItem[];
  @property({ type: String }) timestamp?: string;

  render() {
    return html`
      <div class="container">
        <div class="header" part="header">
          <slot name="header"></slot>
        </div>
        <div class="body" part="body">
          ${this.items && this.items.length > 0
            ? repeat(this.items, (_, idx) => idx, (item, idx) => {
                return item.type === 'text' ? html`
                  <uc-text-block 
                    .value=${item.value}
                  ></uc-text-block>`
                : item.type === 'markdown' ? html`
                  <uc-markdown-block 
                    .value=${item.value}
                  ></uc-markdown-block>`
                : item.type === 'thinking' ? html`
                  <uc-thinking-block 
                    ?loading=${this.items?.length === ((idx || 0) + 1)}
                    .value=${item.value}
                  ></uc-thinking-block>`
                : item.type === 'tool' ? html`
                  <uc-tool-block
                    .index=${idx}
                    .status=${item.status}
                    .name=${item.name}
                    .input=${item.input}
                    .output=${item.output}
                  ></uc-tool-block>`
                : nothing})
            : html`<uc-dot-bounce-loader></uc-dot-bounce-loader>`}
        </div>
        <div class="footer" part="footer">
          <uc-copy-button
            .value=${this.getTextValue(this.items)}
          ></uc-copy-button>
          <slot name="footer"></slot>
          <div style="flex:1;"></div>
          <div class="timestamp">
            ${format(this.timestamp)}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 텍스트 및 마크다운 블록의 내용을 모아서 하나의 문자열로 반환합니다.
   */ 
  private getTextValue = (items?: BlockItem[]) => {
    if (!items) return '';

    return items.reduce((acc, item) => {
      if (item.type === 'text' || item.type === 'markdown') {
        return acc ? acc + "\n" + (item.value || '') : (item.value || '');
      }
      return acc;
    }, '');
  }
}
