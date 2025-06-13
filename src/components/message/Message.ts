import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { BaseElement } from '../../internal/BaseElement.js';
import { CopyButton } from '../buttons/CopyButton.js';
import { Icon } from '../icon/Icon.js';
import { TextBlock } from '../blocks/TextBlock.js';
import { MarkdownBlock } from '../blocks/MarkdownBlock.js';
import { ThinkingBlock } from '../blocks/ThinkingBlock.js';
import { ToolBlock } from '../blocks/ToolBlock.js';
import { DotBounceLoader } from '../loaders/DotBounceLoader.js';
import { format } from '../../utilities/time-functions.js';
import type { BlockContent } from './Message.types.js';
import { styles } from './Message.styles.js';

export class Message extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'uc-text-block': TextBlock,
    'uc-markdown-block': MarkdownBlock,
    'uc-thinking-block': ThinkingBlock,
    'uc-tool-block': ToolBlock,
    'uc-copy-button': CopyButton,
    'uc-icon': Icon,
    'uc-dot-bounce-loader': DotBounceLoader
  };

  @property({ type: String }) name?: string;
  @property({ type: String }) timestamp?: string;
  @property({ type: Array }) content?: BlockContent[];

  render() {
    return html`
      <div class="container">
        <div class="header" part="header">
          <div class="name">${this.name}</div>
          <slot name="header"></slot>
        </div>
        <div class="body" part="body">
          ${this.content && this.content.length > 0
            ? repeat(this.content, (_, idx) => idx, (item, idx) => {
                return item.type === 'text'
                ? html`
                  <uc-text-block 
                    .value=${item.value}
                  ></uc-text-block>`
                : item.type === 'markdown'
                ? html`
                  <uc-markdown-block 
                    .value=${item.value}
                  ></uc-markdown-block>`
                : item.type === 'thinking' 
                ? html`
                  <uc-thinking-block 
                    ?loading=${this.content?.length === ((idx || 0) + 1)}
                    .value=${item.value}
                  ></uc-thinking-block>`
                : item.type === 'tool'
                ? html`
                  <uc-tool-block
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
            .value=${this.gatherTextValue(this.content)}
          ></uc-copy-button>
          <slot name="footer"></slot>
          <div class="flex"></div>
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
  private gatherTextValue = (content: BlockContent[] | undefined) => {
    if (!content) return '';

    return content.reduce((acc, block) => {
      if (block.type === 'text' || block.type === 'markdown') {
        return acc + (block.value || '');
      }
      return acc;
    }, '');
  }
}
