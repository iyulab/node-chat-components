import { html } from "lit";
import { styles } from "./BarLoader.styles.js";

import { BaseElement } from "../../internal/BaseElement.js";

export class BarLoader extends BaseElement {
  static styles = [ styles ];
  
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
