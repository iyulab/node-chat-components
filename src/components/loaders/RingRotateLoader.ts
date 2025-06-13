import { html } from "lit";

import { BaseElement } from "../../internal/BaseElement.js";
import { styles } from "./RingRotateLoader.styles.js";

/**
 * 링이 회전하는 로딩 애니메이션 컴포넌트입니다.
 */
export class RingRotateLoader extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {};
  
  render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12,23a9.63,9.63,0,0,1-8-9.5,9.51,9.51,0,0,1,6.79-9.1A1.66,1.66,0,0,0,12,2.81h0a1.67,1.67,0,0,0-1.94-1.64A11,11,0,0,0,12,23Z"></path>
      </svg>
    `;
  }
}
