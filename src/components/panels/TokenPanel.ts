import { LitElement, html, css, PropertyValues, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('token-panel')
export class TokenPanel extends LitElement {

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
        ${this.maxValue > 0 
          ? html`<div class="gauge"><div class="gauge-bar"></div></div>`
          : nothing}
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
    return value.toLocaleString();
  }

  static styles = css`
    :host {
      display: block;
      width: 160px;
      height: 80px;

      padding: 8px;
      border-radius: 8px;
      border: 1px solid var(--uc-border-color-low);
      background-color: var(--uc-background-color-0);
      box-shadow: 0 1px 3px var(--uc-shadow-color-low);
      box-sizing: border-box;
    }

    .container {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 6px;
    }

    .title {
      font-size: 12px;
      font-weight: 600;
      line-height: 1.5;
    }

    .counters {
      font-size: 12px;
      display: flex;
      flex-direction: row;
      align-items: baseline;
      justify-content: space-between;
      width: 100%;

      .usage-count {
        font-weight: 600;
        color: var(--uc-blue-color-600);
      }

      .max-count {
        font-weight: 300;
        color: var(--uc-text-color-mid);
      }
    }

    .gauge {
      width: 100%;
      height: 8px;
      border-radius: 4px;
      border: 1px solid var(--uc-border-color-low);
      background-color: var(--uc-background-color-300);
      box-sizing: border-box;
      overflow: hidden;

      .gauge-bar {
        width: 100%;
        height: 100%;
        background-color: var(--uc-success-color);
        transform-origin: left;
        transform: scaleX(0);
        transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .gauge-bar.warning {
        background-color: var(--uc-warning-color);
      }
      .gauge-bar.critical {
        background-color: var(--uc-danger-color);
      }
    }
  `;
}