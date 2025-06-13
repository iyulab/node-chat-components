import { html } from "lit";

import { BaseElement } from "../../internal/BaseElement.js";
import { styles } from "./BarBounceLoader.styles.js";

/**
 * 여러 개의 바가 위아래로 튕기면서 로딩 상태를 표시합니다.
 */
export class BarBounceLoader extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {};
  
  render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <rect class="bar" x="1" y="6" width="2.8" height="12" />
        <rect class="bar d1" x="5.8" y="6" width="2.8" height="12" />
        <rect class="bar d2" x="10.6" y="6" width="2.8" height="12" />
        <rect class="bar d3" x="15.4" y="6" width="2.8" height="12" />
        <rect class="bar d4" x="20.2" y="6" width="2.8" height="12" />
      </svg>
    `;
  }
}
