import { LitElement, PropertyValues, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { ToolContent } from "../../types";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

@customElement('tool-block')
export class ToolBlock extends LitElement {

  @property({ type: Object }) value?: ToolContent;
  @property({ type: String, reflect: true }) status: string = this.value?.status || 'pending';
  @property({ type: Boolean, reflect: true }) collapsed: boolean = true;

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('value')) {
      this.status = this.value?.status || 'pending';
    }
  }

  render() {
    if (!this.value) return nothing;
    
    return html`
      <div class="container">
        <div class="header" @click=${this.toggle}>
          ${this.status === 'pending'
            ? html`<div class="title">⏳ Tool Waiting</div>`
            : this.status === 'ready'
            ? html`<div class="title">🛠 Tool Ready</div>`
            : this.status === 'processing'
            ? html`<div class="title">🔄 Tool Used</div>`
            : this.status === 'success'
            ? html`<div class="title">✅ Tool Result</div>`
            : this.status === 'failed'
            ? html`<div class="title">❌ Tool Failed</div>`
            : nothing}
          
          ${this.status === 'success' || this.status === 'failed'
            ? this.collapsed
              ? html`<uc-icon name="plus"></uc-icon>`
              : html`<uc-icon name="minus"></uc-icon>`
            : nothing}
        </div>
        <div class="body">
          <div class="content">
            <div class="label">Argument</div>
            <pre class="value">${this.value.arguments}</pre>
            <div class="label">Result</div>
            <pre class="value">${this.value.result}</pre>
          </div>
        </div>
        <div class="footer">
          <uc-button @click=${this.denied}>
            Deny
          </uc-button>
          <uc-button @click=${this.confirmed}>
            Confirm
          </uc-button>
        </div>
      </div>
    `;
  }

  private toggle = () => {
    if (this.value && !(this.status === 'success' || this.status === 'failed')) return;
    this.collapsed = !this.collapsed;
  }

  private denied = () => {
    this.dispatchEvent(new CustomEvent('tool-denied', { 
      detail: this.value, bubbles: true, composed: true 
    }));
  }

  private confirmed = () => {
    this.dispatchEvent(new CustomEvent('tool-confirmed', { 
      detail: this.value, bubbles: true, composed: true 
    }));
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: auto;
    }
    :host([collapsed]) .body {
      height: 0;
      padding: 0;
      overflow: hidden;
    }

    .container {
      display: block;
      border-radius: 8px;
      border: 1px solid var(--uc-border-color-mid);
      box-sizing: border-box;
    }

    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 5px 10px;
      box-sizing: border-box;
      cursor: pointer;
    }
    .header .title {
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
    }

    .body {
      height: auto;
      padding: 5px 10px;
      overflow-wrap: anywhere;
      box-sizing: border-box;
    }

    .footer {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      padding: 5px 10px;
      box-sizing: border-box;
    }

    .footer uc-button {
      font-size: 12px;
    }

    .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--uc-border-color-mid);
      border-radius: 8px;
      box-sizing: border-box;
      color: var(--uc-text-color-high);
      font-size: 12px;
      line-height: 1.5;
    }

    .content .label {
      width: 100%;
      font-weight: 600;
      padding: 4px 8px;
      border-bottom: 1px solid var(--uc-border-color-mid);
      box-sizing: border-box;
      background-color: var(--uc-background-color-500);
    }

    .content .value {
      width: 100%;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      font-weight: 300;
      overflow: auto;
      max-height: 200px;
      padding: 8px;
      margin: 0;
      box-sizing: border-box;
      background-color: var(--uc-background-color-200);
    }

  `;
}
