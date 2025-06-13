import { html } from "lit";

import { BaseElement } from "../../internal/BaseElement.js";
import { styles } from "./BarRotateLoader.styles.js";

/**
 * 여러 개의 바가 회전하면서 로딩 상태를 표시합니다.
 */
export class BarRotateLoader extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {};
  
  render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g class="bars">
          <rect x="11" y="1" width="2" height="5" opacity=".14"/>
          <rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29"/>
          <rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43"/>
          <rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57"/>
          <rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71"/>
          <rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86"/>
          <rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)"/>
        </g>
      </svg>
    `;
  }
}
