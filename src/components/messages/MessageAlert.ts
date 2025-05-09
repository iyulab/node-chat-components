import { LitElement, html, css, PropertyValues, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

@customElement('message-alert')
export class MessageAlert extends LitElement {
  private timeoutId?: number;

  @query('.progress-bar') progressBarEl!: HTMLElement;

  @state() expanded: boolean = false;

  @property({ type: String }) theme: "warning" | "danger" | "info" | "success" = "warning";
  @property({ type: Boolean, reflect: true }) open: boolean = false;
  @property({ type: Number }) maxRows: number = 3;
  @property({ type: Number }) timeout: number = 0;
  @property({ type: String }) headline?: string;
  @property({ type: String }) value?: string;

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    
    if (changedProperties.has('theme') && this.theme) {
      this.style.setProperty('--primary-color', `var(--uc-${this.theme}-color)`);
    }
    if (changedProperties.has('maxRows') && this.open) {
      this.style.setProperty('--max-rows', `${this.maxRows}`);
    }
    if (changedProperties.has('open') && this.open && this.timeout > 0) {
      this.startTimer();
    }
    if (changedProperties.has('value') && this.value) {
      
    }
  }

  render() {
    return html`
      <div class="container">
        <div class="progress">
          <div class="progress-bar"></div>
        </div>
        <div class="header">
          <uc-icon class="icon" name=${this.theme}></uc-icon>
          <div class="title">${this.headline || this.theme.toUpperCase()}</div>
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

  static styles = css`
    :host {
      opacity: 0;
      pointer-events: none;
      transform: translateY(20px);
      transition: opacity 0.3s ease, transform 0.3s ease;

      --primary-color: var(--uc-danger-color);
      --max-width: 500px;
      --max-height: 300px;
      --max-rows: 3;
    }
    :host([open]) {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }

    .container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      max-width: var(--max-width);
      background-color: var(--uc-background-color-0);
      border: 1px solid var(--uc-border-color-mid);
      border-radius: 4px;
      box-shadow: 0 2px 10px var(--uc-shadow-color-mid);
      overflow: hidden;
    }

    .progress {
      display: block;
      height: 3px;
      width: 100%;

      .progress-bar {
        background-color: var(--primary-color);
        height: 100%;
        width: 100%;
        transform-origin: left;
      }
    }

    .header {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 6px 8px 0px 8px;
      gap: 8px;
      box-sizing: border-box;

      .icon {
        font-size: 18px;
        color: var(--primary-color);
      }
      
      .title {
        font-size: 14px;
        font-weight: 600;
        line-height: 18px;
      }

      .flex {
        flex: 1;
      }

      .close-btn {
        font-size: 18px;
        color: var(--primary-color);
        cursor: pointer;
      }
      .close-btn:hover {
        opacity: 0.7;
      }
    }
  
    .body {
      width: 100%;
      font-size: 14px;
      font-weight: 300;
      line-height: 1.5;
      max-height: calc(1.5em * var(--max-rows) + 8px);
      padding: 4px 8px;
      box-sizing: border-box;
      overflow: hidden;
      transition: max-height 0.3s ease;

      .expand-btn {
        position: absolute;
        bottom: 4px;
        left: 50%;
        transform: translateX(-50%);
        color: rgba(171, 171, 171, 0.5);
        cursor: pointer;
      }
      .expand-btn:hover {
        opacity: 0.7;
      }
    }
    .body.expanded {
      overflow: auto;
      max-height: var(--max-height);
    }
  `;
}
