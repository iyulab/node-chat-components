import { html } from "lit";
import { property } from "lit/decorators.js";

import { BaseElement } from "@iyulab/components/dist/components/BaseElement.js";
import { Icon } from "@iyulab/components/dist/components/icon/Icon.js";
import { styles } from "./ThinkingButton.styles.js";

export type ThinkingValue = "low" | "medium" | "high" | "none";

/**
 * 모델이 추론을 사용하고자 할 때 사용하는 버튼입니다.
 */
export class ThinkingButton extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-icon': Icon
  };
  
  private readonly states = ["none", "low", "medium", "high"] as const;

  /** 비활성화 상태 */
  @property({ type: Boolean, reflect: true }) disabled: boolean = false;
  /** 추론 활성화 값 */
  @property({ type: String, reflect: true }) value: ThinkingValue = "none";

  render() {
    return html`
      <div class="container" @click="${this.changeValue}">
        <u-icon name=${this.getIconName()}></u-icon>
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
    this.emit("change", this.value);
  }
}