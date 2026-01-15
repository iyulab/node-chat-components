import { nothing } from "lit";
import { property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { Marked } from "marked";
import markedKatex from "marked-katex-extension";

import { BaseElement } from "@iyulab/components/dist/components/BaseElement.js";
import { UCodeBlock } from "./UCodeBlock.component.js";
import { UCitationTag } from "../tags/UCitationTag.component.js";
import type { Citation } from "../message/UMessage.types.js";
import { styles } from "./UMarkedBlock.styles.js";

/**
 * 마크다운 컨텐츠를 렌더링하는 컴포넌트입니다.
 */
export class UMarkedBlock extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-code-block': UCodeBlock,
    'u-citation-tag': UCitationTag
  };

  private parser = new Marked({
    pedantic: false,  // 엄격한 마크다운 규격 준수하지 않음 (markdown.pl을 따르지 않음)
    gfm: true,        // GitHub Flavored Markdown 사용
    breaks: true,     // 단순 줄바꿈 또한 <br> 태그로 변환
    silent: true,     // 파싱 오류 발생 시 예외를 발생시키지 않고 메시지를 출력
    renderer: {
      code: ({ text, lang }) => {
        lang ||= 'plaintext'; // 기본값은 'plaintext'
        text = this.sanitize(text);
        return `<u-code-block lang="${lang}">${text}</u-code-block>`;
      },
    },
  })
  .use(markedKatex({ output: "mathml" }));  // katex 수식 렌더링

  /** 마크다운 컨텐츠를 렌더링할 때 사용할 값입니다. */
  @property({ type: String }) value?: string;
  /** 컨텐츠의 인용 출처들입니다. */
  @property({ type: Array }) citations?: Citation[];

  render() {
    if (!this.value) return nothing;
    
    return unsafeHTML(this.parse(this.value));
  }

  /**
   * 마크다운 문자열을 파싱하여 HTML 문자열로 변환합니다.
   * citations 속성에 정의된 인용 태그를 삽입합니다.
   * @param value 변환할 마크다운 문자열
   * @returns 변환된 HTML 문자열
   */
  private parse(value: string): string {
    // 역순으로 태그 삽입 (뒤에서부터 삽입하면 앞의 인덱스가 변하지 않음)
    if (this.citations && this.citations.length > 0) {
      const reversed = [...this.citations].sort((a, b) => b.endIndex - a.endIndex);
      reversed.forEach((citation) => {
        const tag = `<u-citation-tag href="${citation.url}">${citation.name}</u-citation-tag>`;
        value = value.slice(0, citation.endIndex) + tag + value.slice(citation.endIndex);
      });
    }

    // 특수 제어 문자 제거 (Zero Width Space, LTR/RTL marks, BOM 등)
    value = value.replace(/\u200B|\u200C|\u200D|\u200E|\u200F|\uFEFF/g, "");
    return this.parser.parse(value, { async: false }) as string;
  }

  /**
   * HTML 속성에 안전하게 삽입하기 위해 특수문자를 이스케이프합니다.
   * XSS 공격을 방지하기 위한 처리입니다.
   * @param value 원본 문자열
   * @returns 이스케이프 처리된 문자열
   */
  private sanitize(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}