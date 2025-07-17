import { html } from "lit";
import { property } from "lit/decorators.js";

import { BaseElement } from "../../internal/BaseElement.js";
import { Icon } from "../icon/Icon.js";
import { styles } from "./ThinkButton.styles.js";

export type ThinkButtonValue = "low" | "medium" | "high" | "none";

/**
 * 모델이 추론을 사용하고자 할 때 사용하는 버튼입니다.
 */
export class ThinkButton extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'uc-icon': Icon
  };
  private readonly states = ["none", "low", "medium", "high"] as const;

  /** 비활성화 상태 */
  @property({ type: Boolean, reflect: true }) disabled: boolean = false;
  /** 추론 활성화 값 */
  @property({ type: String, reflect: true }) value: ThinkButtonValue = "none";

  render() {
    return html`
      <div class="container" @click="${this.changeValue}">
        <uc-icon name=${this.getIconName()}></uc-icon>
        <div class="indicators">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
  }

  /** 현재 추론 상태에 따라 아이콘 이름을 반환합니다. */
  private getIconName() : string {
    switch (this.value) {
      case "low": return "lightbulb";
      case "medium": return "lightbulb";
      case "high": return "lightbulb-fill";
      default: return "lightbulb-off";
    }
  }

  /** 현재 추론 상태를 변경합니다. */
  private changeValue() {
    if (this.disabled) return;

    this.value ||= "none"; // 초기값 설정
    const currentIdx = this.states.indexOf(this.value);
    const nextIdx = (currentIdx + 1) % this.states.length;
    this.value = this.states[nextIdx];
    this.dispatch("change", this.value);
  }
}
