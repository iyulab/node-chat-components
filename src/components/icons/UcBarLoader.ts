import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('uc-bar-loader')
export class UcBarLoader extends LitElement {
  
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

    .bounce-bar {
      animation: bounce 0.9s linear infinite;
      animation-delay: -0.9s;
    }
    .delay-1 {
      animation-delay: -0.8s;
    }
    .delay-2 {
      animation-delay: -0.7s;
    }
    .delay-3 {
      animation-delay: -0.6s;
    }
    .delay-4 {
      animation-delay: -0.5s;
    }

    @keyframes bounce {
      0%, 66.66% {
        animation-timing-function: cubic-bezier(0.36, 0.61, 0.3, 0.98);
        y: 6px;
        height: 12px;
      }
      33.33% {
        animation-timing-function: cubic-bezier(0.36, 0.61, 0.3, 0.98);
        y: 1px;
        height: 22px;
      }
    }
  `;
}
