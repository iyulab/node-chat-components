import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import hljs from "highlight.js";

import { BaseElement } from "@iyulab/components/dist/components/BaseElement.js";
import { UCopyButton } from "../buttons/UCopyButton.component.js";
import { styles } from "./UCodeBlock.styles.js";

/**
 * 코드 블록을 렌더링하는 컴포넌트입니다.
 * 언어와 코드를 받아 syntax highlighting을 적용합니다.
 */
export class UCodeBlock extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-copy-button': UCopyButton,
  };

  /** 코드 블록의 헤더를 숨길지 여부를 지정합니다. */
  @property({ type: Boolean, reflect: true }) headless: boolean = false;
  /** 코드 언어를 지정합니다. */
  @property({ type: String }) language: string = 'plaintext';
  /** 표시할 코드 내용입니다. */
  @property({ type: String }) value?: string;

  render() {
    if (!this.value) return nothing;
    // 지원하지 않는 경우 'plaintext'로 설정
    const lang = hljs.getLanguage(this.language) ? this.language : 'plaintext';

    return html`
      <div class="header" ?hidden=${this.headless}>
        <span class="language">${lang}</span>
        <u-copy-button mode="badge" .value="${this.value}"></u-copy-button>
      </div>
      ${unsafeHTML(`<pre class="hljs">${this.parse(this.value, lang)}</pre>`)}
    `;
  }

  /**
   * 코드에 구문 강조를 적용합니다.
   * @param value 코드 문자열
   * @param lang 코드 언어
   * @returns 구문 강조가 적용된 HTML 문자열
   */
  private parse(value: string, lang: string): string {
    return hljs.highlight(value, { 
      language: lang,
    }).value;
  }
}