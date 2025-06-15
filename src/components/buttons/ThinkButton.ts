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
  @property({ type: String, reflect: true }) mode: "low" | "medium" | "high" | "none" = "none";

  render() {
    return html`
      <div class="container" @click="${this.selectThinkMode}">
        <uc-icon
          status=${this.mode}
          name=${this.mode === "low" ? "lightbulb"
            : this.mode === "medium" ? "lightbulb-half"
            : this.mode === "high" ? "lightbulb-fill"
            : "lightbulb-off"}
        ></uc-icon>
        <div class="label">
          Think Mode
        </div>
        <uc-tooltip .trigger=${this as any}>
          ${this.mode === "low" ? "Low Think Mode: Minimal reasoning."
            : this.mode === "medium" ? "Medium Think Mode: Moderate reasoning."
            : this.mode === "high" ? "High Think Mode: Extensive reasoning."
            : "No Think Mode: No reasoning."}
        </uc-tooltip>
      </div>
    `;
  }

  private selectThinkMode() {
    // 현재 상태에 따라 다음 상태로 전환합니다.
    if (this.mode === "low") {
      this.mode = "medium";
    } else if (this.mode === "medium") {
      this.mode = "high";
    } else if (this.mode === "high") {
      this.mode = "none";
    } else {
      this.mode = "low";
    }
    this.dispatch("select-think", this.mode);
  }
}
