import { html } from "lit";

import { BaseElement } from "../../internal/BaseElement.js";
import { styles } from "./RingStretchLoader.styles.js";

/**
 * 회전하는 링의 크기가 늘어났다 줄어드는 로딩 애니메이션 컴포넌트입니다.
 */
export class RingStretchLoader extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {};
  
  render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g class="ring">
          <circle cx="12" cy="12" r="9.5" fill="none" stroke-width="3"/>
        </g>
      </svg>
    `;
  }
}
