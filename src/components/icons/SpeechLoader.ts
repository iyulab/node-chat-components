import { customElement } from "lit/decorators.js";
import { LitElement, css, html } from "lit";

@customElement('speech-loader')
export class SpeechLoader extends LitElement {
  render() {
    return html`
      <div class="loader"></div>
    `;
  }

  static styles = css`
    :host {
      display: inline-flex;
    }

    .loader {
      width: 40px;
      aspect-ratio: 4;
      background: radial-gradient(circle closest-side, currentColor 90%, #0000) 0/calc(100%/3) 100% space;
      clip-path: inset(0 100% 0 0);
      animation: l1 1s steps(4) infinite;
    }

    @keyframes l1 {
      to {
        clip-path: inset(0 -34% 0 0);
      }
    }
  `;
}