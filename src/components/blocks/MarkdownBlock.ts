import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { until } from 'lit/directives/until.js';

import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

import { BaseElement } from "../../internal/BaseElement.js";
import { styles } from "./MarkdownBlock.styles.js";

export class MarkdownBlock extends BaseElement {
  static styles = [ styles ]

  private marked = new Marked(
    markedHighlight({
      emptyLangClass: 'hljs',
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      }
    })
  );

  @property({ type: String }) value?: string;

  render() {
    if (!this.value) return nothing;

    return until(this.parse(this.value).then((value) => {
      return html`
        <div class="markdown-body">
          ${unsafeHTML(value)}
        </div>
      `;
    }),nothing);
  }

  private parse = async (value: string) => {
    // 시작부분에서 특수 제어문자(실제 문자가 아닌 컨트롤 문자, ex: 인코딩, 쓰기 방향표시 등)를 제거합니다.
    value = value.replace(/\u200B|\u200C|\u200D|\u200E|\u200F|\uFEFF/g, "");
    value = await this.marked.parse(value, {
      async: true,
      gfm: true,
    });

    // DOMPurify를 사용하여 HTML 코드에 대한 XSS 공격을 방지
    // value = DOMPurify.sanitize(value);
    return value;
  }
}
