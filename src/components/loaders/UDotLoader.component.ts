import { html } from "lit";

import { BaseElement } from "@iyulab/components/dist/components/BaseElement.js";
import { styles } from "./UDotLoader.styles.js";

/**
 * 점 3개 로더 컴포넌트입니다.
 */
export class UDotLoader extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {};

  render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <circle class="d0" cx="4" cy="12" r="3" />
        <circle class="d1" cx="12" cy="12" r="3" />
        <circle class="d2" cx="20" cy="12" r="3" />
      </svg>
    `;
  }
}