import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('lc-button')
export class LcButton extends LitElement {

  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: String }) tooltip?: string;

  render() {
    return html`
      <slot></slot>
      <div class="tooltip">
        ${this.tooltip}
      </div>
      <div class="overlay">
        <lc-spinner></lc-spinner>
      </div>
    `;
  }

  static styles = css`
    :host {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      border: none;
      border-radius: 8px;
      padding: 8px;
      font-size: 16px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: var(--hs-primary-color);
      
      transition: opacity 0.3s ease;
      box-sizing: border-box;
      user-select: none;
      cursor: pointer;
    }
    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }
    :host([loading]) {
      pointer-events: none;
    }
    :host([loading]) .overlay {
      display: flex;
    }

    .tooltip {
      position: absolute;
      z-index: 1000;
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 14px;
      pointer-events: none;
      display: none;
    }

    .overlay {
      display: none;
      position: absolute;
      z-index: 100;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      align-items: center;
      justify-content: center;

      padding: inherit;
      font-size: inherit;
      border-radius: inherit;
      background-color: inherit;
    }
  `;
}
