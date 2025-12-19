import { html } from "lit";
import { property } from "lit/decorators.js";

import { BaseElement } from "@iyulab/components/dist/components/BaseElement.js";
import { UIcon } from "@iyulab/components/dist/components/icon/UIcon.component.js";
import { styles } from "./USendButton.styles.js";

/**
 * 메시지 전송/중단 버튼 컴포넌트입니다.
 */
export class USendButton extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-icon': UIcon,
  };

  /** 로딩 상태 (로딩 중일 때 중단 버튼으로 변경됨) */
  @property({ type: String }) mode: "send" | "stop" | "retry" = "send";
  /** 비활성화 상태 */
  @property({ type: Boolean, reflect: true }) disabled: boolean = false;

  render() {
    return html`
      <u-icon
        lib="internal"
        name=${this.mode === "send" ? "arrow-up" :
          this.mode === "stop" ? "ban" :
          this.mode === "retry" ? "arrow-clockwise" :
          ""}
      ></u-icon>
    `;
  }
}