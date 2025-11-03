import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { UElement } from '@iyulab/components/internals/UElement.js';
import { CopyButton } from '../copy-button/CopyButton.js';
import { TextBlock } from '../text-block/TextBlock.js';
import { MarkdownBlock } from '../markdown-block/MarkdownBlock.js';
import { ThinkingBlock } from '../thinking-block/ThinkingBlock.js';
import { ToolBlock } from '../tool-block/ToolBlock.js';
import type { BlockItem } from './Message.types.js';
import { format } from '../../internals/date-functions.js';
import { styles } from './Message.styles.js';

export class Message extends UElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof UElement> = {
    'u-text-block': TextBlock,
    'u-markdown-block': MarkdownBlock,
    'u-thinking-block': ThinkingBlock,
    'u-tool-block': ToolBlock,
    'u-copy-button': CopyButton
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
                  <u-text-block 
                    .value=${item.value}
                  ></u-text-block>`
                : item.type === 'markdown' ? html`
                  <u-markdown-block 
                    .value=${item.value}
                  ></u-markdown-block>`
                : item.type === 'thinking' ? html`
                  <u-thinking-block 
                    ?loading=${this.items?.length === ((idx || 0) + 1)}
                    .value=${item.value}
                  ></u-thinking-block>`
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
          <u-copy-button
            .value=${this.getTextValue(this.items)}
          ></u-copy-button>
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
