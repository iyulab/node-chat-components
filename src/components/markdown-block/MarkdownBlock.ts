import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { Marked } from "marked";
import markedAlert from "marked-alert";
import markedFootnote from "marked-footnote";
import markedKatex from "marked-katex-extension";

import { UElement } from "@iyulab/components/dist/internals/UElement.js";
import { CodeBlock } from "../code-block/CodeBlock.js";
import { styles } from "./MarkdownBlock.styles.js";

/**
 * 마크다운 컨텐츠를 렌더링하는 컴포넌트입니다.
 */
export class MarkdownBlock extends UElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof UElement> = {
    'u-code-block': CodeBlock,
  };

  private parser = new Marked({
    pedantic: false,  // 엄격한 마크다운 규격 준수하지 않음 (markdown.pl을 따르지 않음)
    gfm: true,        // GitHub Flavored Markdown 사용
    breaks: true,     // 단순 줄바꿈 또한 <br> 태그로 변환
    silent: true,     // 파싱 오류 발생 시 예외를 발생시키지 않고 메시지를 출력
    renderer: {
      code: ({ text, lang }) => {
        lang ||= 'plaintext'; // 기본값은 'plaintext'
        text = this.sanitizeCode(text);
        return `<u-code-block language="${lang}" value="${text}"></u-code-block>`;
      },
    },
  })
  .use(markedAlert())                       // gfm alert 기능 활성화
  .use(markedFootnote())                    // grm footnote 기능 활성화
  .use(markedKatex({ output: "mathml" }));  // katex 수식 렌더링

  /** 마크다운 컨텐츠를 렌더링할 때 사용할 값입니다. */
  @property({ type: String }) value?: string;

  render() {
    if (!this.value) return nothing;

    return html`
      <div class="markdown-body">
        ${unsafeHTML(this.parse(this.value))}
      </div>
    `;
  }

  /**
   * 마크다운 문자열을 HTML로 변환합니다.
   * @param value 변환할 마크다운 문자열
   * @returns 변환된 HTML 문자열
   */
  private parse(value: string) {
    // const start = performance.now();
    // 시작부분에서 특수 제어문자(실제 문자가 아닌 컨트롤 문자, ex: 인코딩, 쓰기 방향표시 등)를 제거합니다.
    value = value.replace(/\u200B|\u200C|\u200D|\u200E|\u200F|\uFEFF/g, "");
    value = this.parser.parse(value, { async: false });
    // const end = performance.now();
    // console.debug(`Markdown Parser: took ${end - start}ms`);
    return value;
  }

  /**
   * HTML 속성에 안전하게 삽입하기 위해 특수문자를 이스케이프합니다.
   * @param value 원본 문자열
   */
  private sanitizeCode(value: string): string {
    return value.replace(/&/g, "&amp;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
  }
}
