import { html, nothing } from "lit";
import { property } from "lit/decorators.js";

import { BaseElement } from "../../internal/BaseElement.js";
import { Icon } from "../icon/Icon.js";
import { Tooltip } from "../tooltip/Tooltip.js";
import { Button } from "../button/Button.js";
import { HourglassRotateLoader } from "../loaders/HourglassRotateLoader.js";
import { RingStretchLoader } from "../loaders/RingStretchLoader.js";
import { JsonViewer } from "../json-viewer/JsonViewer.js";
import type { ToolBlockStatus } from "../message/Message.types.js";
import { styles } from "./ToolBlock.styles.js";
import { JsonNode } from "../json-viewer/JsonViewer.types.js";

export class ToolBlock extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'uc-icon': Icon,
    'uc-tooltip': Tooltip,
    'uc-button': Button,
    'uc-hourglass-rotate-loader': HourglassRotateLoader,
    'uc-ring-stretch-loader': RingStretchLoader,
    'uc-json-viewer': JsonViewer,
  };

  @property({ type: Boolean, reflect: true }) collapsed: boolean = true;
  @property({ type: String }) status: ToolBlockStatus = 'pending';
  @property({ type: Number }) index?: number;
  @property({ type: String }) name?: string;
  @property({ type: String }) input?: string;
  @property({ type: String }) output?: string;

  render() {
    return html`
      <div class="container">
        <div class="header"  @click=${() => this.collapsed = !this.collapsed}>
          ${this.status === 'pending' || this.status === 'paused'
            ? html`<uc-icon name="pause"></uc-icon>`
            : this.status === 'inProgress'
            ? html`<uc-ring-stretch-loader></uc-ring-stretch-loader>`
            : this.status === 'success'
            ? html`<uc-icon name="check"></uc-icon>`
            : this.status === 'failure'
            ? html`<uc-icon name="x-lg"></uc-icon>`
            : nothing}
          <div class="display">
            Tool Call [${this.name}]
          </div>
          <uc-icon
            name=${this.collapsed ? 'plus' : 'minus'}
          ></uc-icon>
        </div>

        <div class="body" ?hidden=${this.collapsed}>
          <div class="viewer" ?hidden=${!this.input}>
            <div class="label">
              <uc-icon name="keyboard"></uc-icon>
              <uc-tooltip placement="left">Input</uc-tooltip>
            </div>
            <uc-json-viewer
              .value=${this.parseJson(this.input)}
            ></uc-json-viewer>
          </div>
          <div class="viewer" ?hidden=${!this.output}>
            <div class="label">
              <uc-icon name="arrow-return"></uc-icon>
              <uc-tooltip placement="left">Output</uc-tooltip>
            </div>
            <uc-json-viewer
              .value=${this.parseJson(this.output)}
            ></uc-json-viewer>
          </div>
        </div>

        <div class="footer" ?hidden=${this.status !== 'paused'}>
          <uc-button @click=${this.handleClickConfirm}>
            <uc-icon name="check"></uc-icon>
            Confirm
          </uc-button>
          <uc-button @click=${this.handleClickDeny}>
            <uc-icon name="x-lg"></uc-icon>
            Deny
          </uc-button>
        </div>
      </div>
    `;
  }

  private parseJson(value?: string): JsonNode {
    if (!value || !value.trim()) return {};
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  handleClickConfirm() {
    this.dispatch('tool-approval', {
      index: this.index,
      isApproved: true,
    });
  }

  handleClickDeny() {
    this.dispatch('tool-approval', {
      index: this.index,
      isApproved: false,
    });
  }
}