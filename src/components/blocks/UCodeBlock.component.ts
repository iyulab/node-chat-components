import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import hljs from "highlight.js";

import { UElement } from "@iyulab/components/dist/components/UElement.js";
import { UIcon } from "@iyulab/components/dist/components/icon/UIcon.component.js";
import { USpinner } from "@iyulab/components/dist/components/spinner/USpinner.component.js";
import { UCopyButton } from "../buttons/UCopyButton.component.js";
import { styles } from "./UCodeBlock.styles.js";

/**
 * 코드 블록을 렌더링하는 컴포넌트입니다.
 * 언어와 코드를 받아 syntax highlighting을 적용합니다.
 */
export class UCodeBlock extends UElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof UElement> = {
    'u-icon': UIcon,
    'u-spinner': USpinner,
    'u-copy-button': UCopyButton,
  };

  /** 클립보드 복사 상태를 나타내는 플래그입니다. */
  @state() isCopied: boolean = false;

  /** 코드 블록이 로딩 중인지 여부를 나타냅니다. */
  @property({ type: Boolean, reflect: true }) loading: boolean = false;
  /** 코드 블록의 헤더를 숨길지 여부를 지정합니다. */
  @property({ type: Boolean, reflect: true }) headless: boolean = false;
  /** 코드 언어를 지정합니다. */
  @property({ type: String, reflect: true }) lang: string = 'plaintext';
  /** 표시할 코드 내용입니다. */
  @property({ type: String }) value?: string;

  render() {
    // 지원하지 않는 경우 'plaintext'로 설정
    const lang = hljs.getLanguage(this.lang) ? this.lang : 'plaintext';
    const value = this.value || '';

    return html`
      <div class="header" ?hidden=${this.headless}>
        <span class="status">
          ${this.loading 
            ? html`<u-spinner></u-spinner>` 
            : html`<u-icon lib="bootstrap" name="code-slash"></u-icon>`}
        </span>
        <span class="lang">
          ${lang}
        </span>
        <div style="flex: 1"></div>
        <u-copy-button
          .value=${value}
        ></u-copy-button>
      </div>

      <pre class="hljs">${unsafeHTML(hljs.highlight(value, { 
        language: lang
      }).value)}</pre>

      <slot hidden @slotchange=${this.handleSlotChange}></slot>
    `;
  }

  /**
   * slot에 할당된 코드를 value로 설정합니다.
   * 이 기능을 통해 HTML 내에 직접 코드를 작성할 수 있습니다.
   */
  private handleSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const nodes = slot.assignedNodes({ flatten: true });

    this.value = nodes.map(node => node.textContent).join('\n\n');
  }
}