import { html } from "lit";

import { BaseElement } from "../../internal/BaseElement.js";
import { styles } from "./DotBounceLoader.styles.js";

/**
 * 여러 개의 점이 위아래로 튕기면서 로딩 상태를 표시합니다.
 */
export class DotBounceLoader extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {};
  
  render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <circle class="dot" cx="4" cy="12" r="3"/>
        <circle class="dot d1" cx="12" cy="12" r="3"/>
        <circle class="dot d2" cx="20" cy="12" r="3"/>
    </svg>
    `;
  }
}
