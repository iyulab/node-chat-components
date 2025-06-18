import { html } from "lit";
import { property } from "lit/decorators.js";

import { BaseElement } from "../../internal/BaseElement.js";
import { Icon } from "../icon/Icon.js";
import { Tooltip } from "../tooltip/Tooltip.js";
import { styles } from "./ThinkButton.styles.js";

/**
 * 모델이 추론을 사용하고자 할 때 사용하는 버튼입니다.
 */
export class ThinkButton extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'uc-icon': Icon,
    'uc-tooltip': Tooltip,
  };

  /** 비활성화 상태 */
  @property({ type: Boolean, reflect: true }) disabled: boolean = false;
  /** 추론 활성화 모드 */
  @property({ type: String, reflect: true }) value: "low" | "medium" | "high" | "none" = "none";

  render() {
    return html`
      <div class="container" @click="${this.changeThinkValue}">
        <uc-icon
          status=${this.value}
          name=${this.value === "low" ? "lightbulb"
            : this.value === "medium" ? "lightbulb-half"
            : this.value === "high" ? "lightbulb-fill"
            : "lightbulb-off"}
        ></uc-icon>
        <div class="label">
          Think Mode
        </div>
        <uc-tooltip .trigger=${this as any}>
          ${this.value === "low" ? "Low Think Mode: Minimal reasoning."
            : this.value === "medium" ? "Medium Think Mode: Moderate reasoning."
            : this.value === "high" ? "High Think Mode: Extensive reasoning."
            : "No Think Mode: No reasoning."}
        </uc-tooltip>
      </div>
    `;
  }

  private changeThinkValue() {
    // 현재 상태에 따라 다음 상태로 전환합니다.
    if (this.value === "low") {
      this.value = "medium";
    } else if (this.value === "medium") {
      this.value = "high";
    } else if (this.value === "high") {
      this.value = "none";
    } else {
      this.value = "low";
    }
    this.dispatch("change-think", this.value);
  }
}
