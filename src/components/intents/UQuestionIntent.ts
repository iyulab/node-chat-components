import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import "@iyulab/components/dist/components/button/UButton.js";
import { ChoiceEventDetail } from "../../events/ChoiceEvent.js";
import { UElement } from "@iyulab/components/dist/components/UElement.js";
import { styles } from "./UQuestionIntent.styles.js";

/**
 * 질문/선택지 제안 블록 컴포넌트
 *
 * LLM이 질문 텍스트(`question`)와 클릭 선택지(`choices`)를 제시하고,
 * `input: true`일 때는 사용자가 직접 텍스트를 입력할 수도 있습니다.
 */
@customElement("u-question-intent")
export class UQuestionIntent extends UElement {
  static styles = [super.styles, styles];

  /** LLM이 제시하는 질문 텍스트 */
  @property({ type: String }) question?: string;
  /** 클릭 가능한 선택지 목록 */
  @property({ type: Array }) choices: string[] = [];

  render() {
    if (!this.choices || this.choices.length === 0) {
      return nothing;
    }

    return html`
      <p class="question" ?hidden=${!this.question}>${this.question}</p>
      <div class="choices">
        ${repeat(this.choices, (value, index) => html`
          <u-button @click=${() => this.handleChoiceClick(index)}>
            ${value}
          </u-button>
        `)}
      </div>
    `;
  }

  private handleChoiceClick(index: number) {
    const value = this.choices[index];
    if (!value) return;
    this.fire<ChoiceEventDetail>('choice', {
      detail: { value },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "u-question-intent": UQuestionIntent;
  }
}