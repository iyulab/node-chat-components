import { LitElement, html } from "lit";
import { styles } from "./BarLoader.styles.js";

export class UcBarLoader extends LitElement {
  static styles = [ styles ];
  
  render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <rect class="bounce-bar" x="1" y="6" width="2.8" height="12" />
        <rect class="bounce-bar delay-1" x="5.8" y="6" width="2.8" height="12" />
        <rect class="bounce-bar delay-2" x="10.6" y="6" width="2.8" height="12" />
        <rect class="bounce-bar delay-3" x="15.4" y="6" width="2.8" height="12" />
        <rect class="bounce-bar delay-4" x="20.2" y="6" width="2.8" height="12" />
      </svg>
    `;
  }
}
