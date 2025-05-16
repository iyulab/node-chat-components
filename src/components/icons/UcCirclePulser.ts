import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('uc-circle-pulser')
export class UcCirclePulser extends LitElement {

  render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <circle class="pulser" cx="12" cy="12" r="0"/>
      </svg>
    `;
  }

  static styles = css`
    :host {
      display: inline-flex;
      font-size: 32px;
      color: inherit;
    }

    svg {
      width: 1em;
      height: 1em;
      fill: currentColor;
    }

    .pulser {
      animation: pulse 2s cubic-bezier(0.52,.6,.25,.99) infinite;
    }
      
    @keyframes pulse {
      0% {
        r: 0;
        opacity: 1;
      }
      100% {
        r: 12px;
        opacity: 0;
      }
    }
  `;
}
