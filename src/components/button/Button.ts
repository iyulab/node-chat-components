import { html } from "lit";
import { property, query } from "lit/decorators.js";

import { computePosition, flip, shift, offset } from "@floating-ui/dom";
import type { Placement } from "@floating-ui/dom";

import { BaseElement } from "../../internal/BaseElement.js";
import { SpinLoader } from "../loaders/SpinLoader.js";
import { styles } from "./Button.styles.js";

export class Button extends BaseElement {
  static dependencies: Record<string, typeof BaseElement> = {
    'uc-spin-loader': SpinLoader
  };
  static styles = [ styles ]

  @query('.tooltip') tooltipEl!: HTMLElement;

  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: String }) tooltip?: string;
  @property({ type: String }) tooltipPosition?: Placement;

  connectedCallback(): void {
    super.connectedCallback();
    this.tabIndex = 0;
    if (this.tooltip) {
      this.addEventListener('mouseenter', this.showTooltip);
      this.addEventListener('mouseleave', this.hideTooltip);
      this.addEventListener('focusin', this.showTooltip);
      this.addEventListener('focusout', this.hideTooltip);
    }
  }

  disconnectedCallback(): void {
    if (this.tooltip) {
      this.removeEventListener('mouseenter', this.showTooltip);
      this.removeEventListener('mouseleave', this.hideTooltip);
      this.removeEventListener('focusin', this.showTooltip);
      this.removeEventListener('focusout', this.hideTooltip);
    }
    super.disconnectedCallback();
  }

  render() {
    return html`
      <slot></slot>
      <div class="overlay">
        <uc-spin-loader></uc-spin-loader>
      </div>
      <div class="tooltip">
        ${this.tooltip}
      </div>
    `;
  }

  private showTooltip = async () => {
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

    this.tooltipEl.classList.add('visible');
  }

  private hideTooltip = () => {
    this.tooltipEl.classList.remove('visible');    
  }
}
