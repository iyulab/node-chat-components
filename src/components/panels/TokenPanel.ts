import { html, PropertyValues } from 'lit';
import { property, query } from 'lit/decorators.js';

import { BaseElement } from '../../internal/BaseElement.js';
import { styles } from './TokenPanel.styles.js';

export class TokenPanel extends BaseElement {
  static styles = [ styles ];

  @query('.gauge-bar') gaugeBarEl!: HTMLElement;

  @property({ type: Number }) warningThreshold = 0.6;
  @property({ type: Number }) criticalThreshold = 0.8;
  @property({ type: Number }) maxValue = 0;
  @property({ type: Number }) value = 0;

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    if (changedProperties.has('value') || changedProperties.has('maxValue')) {
      this.updateValue();
    }
  }

  render() {
    return html`
      <div class="container">
        <div class="title">
          TOKEN USAGE
        </div>
        <div class="counters">
          <div class="usage-count">
            ${this.formatValue(this.value)}
          </div>
          <div class="max-count">
            ${this.maxValue > 0 ? this.formatValue(this.maxValue) : 'unknown'}
          </div>
        </div>
        <div class="gauge">
          <div class="gauge-bar"></div>
        </div>
      </div>
    `;
  }

  private updateValue = async () => {
    await this.updateComplete;
    if (this.value < 0 || this.maxValue < 1) return;

    const ratio = Math.min(this.value / this.maxValue, 1);
    this.gaugeBarEl.style.transform = `scaleX(${ratio})`;
    if (ratio >= this.criticalThreshold) {
      this.gaugeBarEl.classList.remove('warning');
      this.gaugeBarEl.classList.add('critical');
    } else if (ratio >= this.warningThreshold) {
      this.gaugeBarEl.classList.remove('critical');
      this.gaugeBarEl.classList.add('warning');
    } else {
      this.gaugeBarEl.classList.remove('warning', 'critical');
    }
  }

  private formatValue = (value: number) => {
    if (!value || value < 0) return '0';
    return value.toLocaleString();
  }
}