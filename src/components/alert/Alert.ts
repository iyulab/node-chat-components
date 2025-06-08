import { html, PropertyValues, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';

import { BaseElement } from '../../internal/BaseElement.js';
import { Icon } from '../icon/Icon.js';
import { styles } from './Alert.styles.js';

export class Alert extends BaseElement {
  static styles = [ styles ]
  static dependencies: Record<string, typeof BaseElement> = {
    'uc-icon': Icon,
  }
  private timeoutId?: number;

  @query('.progress-bar') progressBarEl!: HTMLElement;

  @state() expanded: boolean = false;

  @property({ type: String }) status: "warning" | "danger" | "info" | "success" = "warning";
  @property({ type: Boolean, reflect: true }) open: boolean = false;
  @property({ type: Number }) maxRows: number = 3;
  @property({ type: Number }) timeout: number = 0;
  @property({ type: String }) headline?: string;
  @property({ type: String }) value?: string;

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    
    if (changedProperties.has('status') && this.status) {
      this.style.setProperty('--primary-color', `var(--uc-${this.status}-color)`);
    }
    if (changedProperties.has('maxRows') && this.open) {
      this.style.setProperty('--max-rows', `${this.maxRows}`);
    }
    if (changedProperties.has('open') && this.open && this.timeout > 0) {
      this.startTimer();
    }
    if (changedProperties.has('value') && this.value) {
      this.startTimer();
    }
  }

  render() {
    return html`
      <div class="container">
        <div class="progress">
          <div class="progress-bar"></div>
        </div>
        <div class="header">
          <uc-icon class="icon" name=${this.status}></uc-icon>
          <div class="title">${this.headline || this.status.toUpperCase()}</div>
          <div class="flex"></div>
          <uc-icon class="close-btn" name="x" @click=${() => this.open = false}></uc-icon>
        </div>
        <div class="body">
          ${this.value}
          ${!this.expanded 
            ? html`<uc-icon class="expand-btn" name="chevron-down" @click=${() => this.expanded = true}></uc-icon>`
            : nothing}
        </div>
      </div>
    `;
  }

  private startTimer = async () => {
    await this.updateComplete;
    this.clearTimer();

    this.progressBarEl.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
      duration: this.timeout,
      easing: 'linear',
      fill: 'forwards',
    });

    this.timeoutId = window.setTimeout(() => {
      this.open = false;
    }, this.timeout);
  }

  private clearTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }
}
