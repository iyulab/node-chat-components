import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { ToolContent } from "../../types";

@customElement('tool-block')
export class ToolBlock extends LitElement {

  @property({ type: Object }) value?: ToolContent;
  @state() collapsed = true;

  render() {
    console.log('ToolBlock.render', this.value);
    if (!this.value) return nothing;
    
    return html`
      <div class="container">
        <div class="header" @click=${() => this.collapsed = !this.collapsed}>
          <uc-icon></uc-icon>
          <div class="name">
            ${this.value.name}
          </div>
          <uc-icon 
            name=${this.collapsed ? 'chevron-down' : 'chevron-up'}
          ></uc-icon>
        </div>
        <div class="body ${this.collapsed ? 'collapsed' : ''}">
          <marked-block
            .value=${`\`\`\`json\n${JSON.stringify(this.value, null, 2)}\n\`\`\``}
          ></marked-block>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      margin: 50px 0px;
    }

    .container {
      border: 1px solid var(--uc-border-color-mid);
      border-radius: 4px;
      margin: 8px 0px;
      box-sizing: border-box;
    }

    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 4px;
      box-sizing: border-box;
      gap: 8px;
      justify-content: space-between;
      cursor: pointer;

      uc-icon {
        font-size: 24px;
      }

      .name {
        flex: 1;
        font-weight: 600;
        line-height: 24px;
      }
    }

    .body {
      width: 100%;
      max-height: 340px;
      transition: max-height 0.3s ease-out;
      overflow: auto;
    }
    .body.collapsed {
      max-height: 0;
      overflow: hidden;
    }
  `;
}
