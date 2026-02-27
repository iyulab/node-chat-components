import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import { BaseElement } from "@iyulab/components/dist/components/BaseElement.js";
import { UIcon } from "@iyulab/components/dist/components/icon/UIcon.component.js";
import { styles } from "./UQuestionsWidget.styles.js";

/**
 * 질문/쿼리 제안 위젯 컴포넌트
 */
export class UQuestionsWidget extends BaseElement {
  static styles = [super.styles, styles];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-icon': UIcon
  };

  /** 질문 아이템 목록 */
  @property({ type: Array }) questions: string[] = [];

  render() {
    if (!this.questions || this.questions.length === 0) {
      return nothing;
    }

    return repeat(this.questions, (value, index) => html`
      <button @click=${() => this.handleButtonClick(index)}>
        <span>${value}</span>
        <u-icon lib="internal" name="chevron-right"></u-icon>
      </button>
    `);
  }

  private handleButtonClick(index: number) {
    const value = this.questions[index];
    if (!value) return;

    this.emit('query', {
      value: value
    });
  }
}
