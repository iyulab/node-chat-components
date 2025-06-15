import { html, nothing } from "lit";
import { property } from "lit/decorators.js";

import { BaseElement } from "../../internal/BaseElement.js";
import { Icon } from "../icon/Icon.js";
import { Button } from "../button/Button.js";
import type { ToolBlockStatus } from "../message/Message.types.js";
import { styles } from "./ToolBlock.styles.js";

export class ToolBlock extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'uc-icon': Icon,
    'uc-button': Button
  };

  @property({ type: String }) status: ToolBlockStatus = 'WAITING';
  @property({ type: String }) name?: string;
  @property({ type: String }) input?: string;
  @property({ type: String }) output?: string;

  @property({ type: Boolean, reflect: true }) collapsed: boolean = true;

  render() {
    if (this.status === 'WAITING') {
      return html`
        <div class="container">
          <div class="header">
            ⏳ Waiting: ${this.name}
          </div>
          <div class="body">
            ${this.input}
          </div>
        </div>
      `;
    } else if (this.status === 'PENDING_APPROVAL') {
      return html`
        <div class="container">
          <div class="header">
            ⏸️ Pending: ${this.name}
          </div>
          <div class="body">
            ${this.input}
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
    } else if (this.status === 'EXECUTING') {
      return html`
        <div class="container">
          <div class="header">
            🔄 Executing: ${this.name}
          </div>
          <div class="body">
            ${this.input}
          </div>
        </div>
      `;
    } else if (this.status === 'SUCCESS') {
      return html`
        <div class="container">
          <div class="header" @click=${this.toggle}>
            ✅ Success: ${this.name}
            ${this.collapsed 
              ? html`<uc-icon name="plus"></uc-icon>`
              : html`<uc-icon name="minus"></uc-icon>`}
          </div>
          <div class="body">
            <div class="content">
              <div class="label">Argument</div>
              <pre class="value">${this.input}</pre>
              <div class="label">Result</div>
              <pre class="value">${this.output}</pre>
            </div>
          </div>
        </div>
      `;
    } else if (this.status === 'FAILED') {
      return html`
        <div class="container">
          <div class="header" @click=${this.toggle}>
            ❌ Failed: ${this.name}
            ${this.collapsed 
              ? html`<uc-icon name="plus"></uc-icon>`
              : html`<uc-icon name="minus"></uc-icon>`}
          </div>
          <div class="body">
            <div class="content">
              <div class="label">Argument</div>
              <pre class="value">${this.input}</pre>
              <div class="label">Error</div>
              <pre class="value">${this.output}</pre>
            </div>
          </div>
        </div>
      `;
    } else {
      return nothing;
    }
  }

  private toggle = () => {
    this.collapsed = !this.collapsed;
  }

  private denied = () => {
    
  }

  private confirmed = () => {

  }
}