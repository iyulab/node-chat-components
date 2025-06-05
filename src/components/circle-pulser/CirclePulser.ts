import { LitElement, html } from 'lit';
import { styles } from './CirclePulser.styles';

export class UcCirclePulser extends LitElement {
  static styles = [ styles ]

  render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <circle class="pulser" cx="12" cy="12" r="0"/>
      </svg>
    `;
  }
}
