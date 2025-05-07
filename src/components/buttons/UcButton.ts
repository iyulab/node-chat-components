import { LitElement, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { computePosition, flip, shift, offset } from "@floating-ui/dom";
import type { Placement } from "@floating-ui/dom";

@customElement('uc-button')
export class UcButton extends LitElement {

  @query('.tooltip') tooltipEl!: HTMLElement;

  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: String }) tooltip?: string;
  @property({ type: String }) tooltipPosition?: Placement;

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('mouseenter', this.compute);
    this.addEventListener('focus', this.compute);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('mouseenter', this.compute);
    this.removeEventListener('focus', this.compute);
  }

  render() {
    return html`
      <slot></slot>
      <div class="overlay">
        <uc-spinner></uc-spinner>
      </div>
      <div class="tooltip">
        ${this.tooltip}
      </div>
    `;
  }

  private compute = async () => {
    console.log("entered!!!!!!!!!!!!!!!!!");
    const { x, y } = await computePosition(this, this.tooltipEl, {
      placement: this.tooltipPosition || 'top',
      middleware: [
        flip(),
        shift(),
        offset(4),
      ],
    });

    Object.assign(this.tooltipEl.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
  }

  static styles = css`
    :host {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      border: 1px solid var(--uc-border-color-500);
      border-radius: 8px;
      padding: 8px;
      font-size: 16px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: transparent;
      
      transition: opacity 0.3s ease;
      box-sizing: border-box;
      user-select: none;
      cursor: pointer;
    }
    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
      cursor: not-allowed;
    }
    :host([loading]) .overlay {
      display: flex;
      pointer-events: none;
    }
    :host(:hover) {
      opacity: 0.8;
    }
    :host(:hover) .tooltip {
      opacity: 1;
    }

    .overlay {
      display: none;
      z-index: 100;
      position: absolute;
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

    .tooltip {
      display: block;
      opacity: 0;
      z-index: 1000;
      position: absolute;
      width: max-content;
      top: 0;
      left: 0;
      
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 14px;

      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      backdrop-filter: blur(5px);
      
      transition: opacity 0.3s ease;
      pointer-events: none;
    }
  `;
}
