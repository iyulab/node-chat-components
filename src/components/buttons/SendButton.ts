import { html } from "lit";
import { property } from "lit/decorators.js";

import { BaseElement } from "../../internal/BaseElement.js";
import { Icon } from "../icon/Icon.js";
import { styles } from "./SendButton.styles.js";

/**
 * 메시지 전송/중단 버튼 컴포넌트입니다.
 */
export class SendButton extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'uc-icon': Icon,
  };

  /** 로딩 상태 (로딩 중일 때 중단 버튼으로 변경됨) */
  @property({ type: String }) mode: "send" | "stop" | "retry" | "voice" = "send";
  /** 비활성화 상태 */
  @property({ type: Boolean, reflect: true }) disabled: boolean = false;

  render() {
    return html`
      <uc-icon name=${this.getIconName(this.mode)}></uc-icon>
    `;
  }

  private getIconName(mode: string): string {
    switch (mode) {
      case "send":
        return "arrow-up";
      case "stop":
        return "square-fill";
      case "retry":
        return "arrow-clockwise";
      case "voice":
        return "mic";
      default:
        return "";
    }
  }
}