import { html } from "lit";
import { property } from "lit/decorators.js";

import { BaseElement } from "@iyulab/components/dist/components/BaseElement.js";
import { Icon } from "@iyulab/components/dist/components/icon/Icon.js";
import { styles } from "./SendButton.styles.js";

/**
 * 메시지 전송/중단 버튼 컴포넌트입니다.
 */
export class SendButton extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-icon': Icon,
  };

  /** 로딩 상태 (로딩 중일 때 중단 버튼으로 변경됨) */
  @property({ type: String }) mode: "send" | "stop" | "retry" = "send";
  /** 비활성화 상태 */
  @property({ type: Boolean, reflect: true }) disabled: boolean = false;

  render() {
    return html`
      <u-icon 
        name=${this.mode === "send" ? "arrow-up" :
          this.mode === "stop" ? "square-fill" :
          this.mode === "retry" ? "arrow-clockwise" :
          ""}
      ></u-icon>
    `;
  }
}