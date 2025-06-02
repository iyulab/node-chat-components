import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('text-block')
export class TextBlock extends LitElement {

  @property({ type: String })
  value?: string;

  render() {
    if (!this.value) return nothing;
    
    return html`${this.value}`;
  }

  static styles = css`
    :host {
      display: block;
      
      /* Font styles */
      font-family: auto;
      font-size: 14px;
      font-weight: 400;
      font-style: normal;
      font-variant: normal;

      /* Color styles */
      color: var(--uc-text-color-high);
      background-color: transparent;
      text-shadow: none;

      /* Alignment styles */
      text-align: left;
      text-decoration: none;
      line-height: 1.5;
      white-space: pre-wrap;
      word-wrap: break-word;
      letter-spacing: normal;
      word-spacing: normal;

      /* Overflow styles */
      overflow: unset; /* 숨김 처리 */
      overflow-wrap: anywhere; /* 텍스트 오버 플로우 처리 */
      text-overflow: unset; /* 텍스트 오버플로우 스타일 처리 */

      white-space: pre-wrap; /* 텍스트의 공백 문자 처리 */

      word-break: break-all; /* 단어 줄 바꿈 처리 */
      word-spacing: normal; /* 단어 간격 */
    }
  `;
}
