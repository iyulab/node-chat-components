import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import { BaseElement } from "@iyulab/components/dist/components/BaseElement.js";
import { styles } from "./UQuestionsBlock.styles.js";

/**
 * 질문/쿼리 제안 블록 컴포넌트
 */
export class UQuestionsBlock extends BaseElement {
  static styles = [super.styles, styles];
  static dependencies: Record<string, typeof BaseElement> = {};

  /** 질문 아이템 목록 */
  @property({ type: Array }) values: string[] = [];

  render() {
    if (!this.values || this.values.length === 0) {
      return nothing;
    }

    return repeat(this.values, (value, index) => html`
      <button @click=${() => this.handleButtonClick(index)}>
        ${value}
      </button>
    `);
  }

  private handleButtonClick(index: number) {
    const value = this.values[index];
    if (!value) return;

    this.emit('query', { value });
    this.remove();
  }
}
