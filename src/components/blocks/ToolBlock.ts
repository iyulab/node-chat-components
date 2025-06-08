import { html, nothing } from "lit";
import { property } from "lit/decorators.js";

import { BaseElement } from "../../internal/BaseElement.js";
import { Button } from "../button/Button.js";
import { styles } from "./ToolBlock.styles.js";
import type { ToolMessageContent } from "../message-box/MessageBox.types.js";

export class ToolBlock extends BaseElement {
  static dependencies: Record<string, typeof BaseElement> = {
    'uc-button': Button
  }
  static styles = [ styles ];

  @property({ type: Object }) value?: ToolMessageContent;
  @property({ type: Boolean, reflect: true }) collapsed: boolean = true;

  render() {
    if (!this.value) return nothing;
    
    return html`
      <div class="container">
        <div class="header" @click=${this.toggle}>
          ${!this.value.isCompleted
            ? html`<div class="title">⏳ Tool Waiting: ${this.value.name}</div>`
            : this.value.isCompleted && this.value.output?.isSuccess
            ? html`<div class="title">✅ Tool Result: ${this.value.name}</div>`
            : this.value.isCompleted && !this.value.output?.isSuccess
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
            <pre class="value">${this.value.input}</pre>
            <div class="label">Result</div>
            <pre class="value">${this.value.output?.data}</pre>
          </div>
        </div>
        ${this.value.isApproved === false
          ? html`
            <div class="footer">
              <uc-button @click=${() => this.denied()}>
                Deny
              </uc-button>
              <uc-button @click=${() => this.confirmed()}>
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
    this.value.isCompleted = true;
    this.value.isApproved = false;
    this.value.output = {
      isSuccess: false,
      data: 'Tool execution was denied by the user.'
    }
    
    this.dispatchEvent(new CustomEvent('tool-change', { 
      detail: this.value
    }));
    this.requestUpdate();
  }

  private confirmed = () => {
    if (!this.value) return;
    this.value.isApproved = true;

    this.dispatchEvent(new CustomEvent('tool-change', { 
      detail: this.value 
    }));
    this.requestUpdate();
  }
}
