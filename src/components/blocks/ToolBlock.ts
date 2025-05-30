import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { ToolContent } from "../../types";

@customElement('tool-block')
export class ToolBlock extends LitElement {

  @property({ type: Object }) value?: ToolContent;
  @property({ type: Boolean, reflect: true }) collapsed: boolean = true;

  render() {
    if (!this.value) return nothing;
    
    return html`
      <div class="container">
        <div class="header" @click=${this.toggle}>
          ${!this.value.isCompleted
            ? html`<div class="title">⏳ Tool Waiting: ${this.value.name}</div>`
            : this.value.isCompleted && this.value.result?.isSuccess
            ? html`<div class="title">✅ Tool Result: ${this.value.name}</div>`
            : this.value.isCompleted && !this.value.result?.isSuccess
            ? html`<div class="title">❌ Tool Failed: ${this.value.name}</div>`
            : nothing}
          
          ${this.value.isCompleted
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
            <pre class="value">${this.value.result?.data}</pre>
          </div>
        </div>
        ${this.value.approvalStatus === 'requires'
          ? html`
            <div class="footer">
              <uc-button @click=${this.denied}>
                Deny
              </uc-button>
              <uc-button @click=${this.confirmed}>
                Confirm
              </uc-button>
            </div>`
          : nothing}
      </div>
    `;
  }

  private toggle = () => {
    if (this.value && !this.value.isCompleted) return;
    this.collapsed = !this.collapsed;
  }

  private denied = () => {
    if (!this.value) return;
    this.value.approvalStatus = 'rejected';
    
    this.dispatchEvent(new CustomEvent('tool-change', { 
      detail: this.value
    }));
    this.requestUpdate();
  }

  private confirmed = () => {
    if (!this.value) return;
    this.value.approvalStatus = 'approved';

    this.dispatchEvent(new CustomEvent('tool-change', { 
      detail: this.value 
    }));
    this.requestUpdate();
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
