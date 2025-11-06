import { html, nothing } from "lit";
import { property } from "lit/decorators.js";

import { UElement } from "@iyulab/components/dist/internals/UElement.js";
import { Icon } from "@iyulab/components/dist/components/icon/Icon.js";
import { Tooltip } from "@iyulab/components/dist/components/tooltip/Tooltip.js";
import { Button } from "@iyulab/components/dist/components/button/Button.js";
import { Spinner } from "@iyulab/components/dist/components/spinner/Spinner.js";
import { JsonViewer } from "../json-viewer/JsonViewer.js";
import type { ToolBlockStatus } from "../message/Message.types.js";
import { styles } from "./ToolBlock.styles.js";
import { JsonNode } from "../json-viewer/JsonViewer.types.js";

export class ToolBlock extends UElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof UElement> = {
    'u-icon': Icon,
    'u-tooltip': Tooltip,
    'u-button': Button,
    'u-spinner': Spinner,
    'u-json-viewer': JsonViewer,
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
            ? html`<u-icon name="pause"></u-icon>`
            : this.status === 'inProgress'
            ? html`<u-spinner></u-spinner>`
            : this.status === 'success'
            ? html`<u-icon name="check"></u-icon>`
            : this.status === 'failure'
            ? html`<u-icon name="x-lg"></u-icon>`
            : nothing}
          <div class="display">
            Tool Call [${this.name}]
          </div>
          <u-icon
            name=${this.collapsed ? 'plus' : 'minus'}
          ></u-icon>
        </div>

        <div class="body" ?hidden=${this.collapsed}>
          <div class="viewer" ?hidden=${!this.input}>
            <div class="label">
              <u-icon name="keyboard"></u-icon>
              <u-tooltip placement="left">Input</u-tooltip>
            </div>
            <u-json-viewer
              .value=${this.parseJson(this.input)}
            ></u-json-viewer>
          </div>
          <div class="viewer" ?hidden=${!this.output}>
            <div class="label">
              <u-icon name="arrow-return"></u-icon>
              <u-tooltip placement="left">Output</u-tooltip>
            </div>
            <u-json-viewer
              .value=${this.parseJson(this.output)}
            ></u-json-viewer>
          </div>
        </div>

        <div class="footer" ?hidden=${this.status !== 'paused'}>
          <u-button @click=${this.handleClickConfirm}>
            <u-icon name="check"></u-icon>
            Confirm
          </u-button>
          <u-button @click=${this.handleClickDeny}>
            <u-icon name="x-lg"></u-icon>
            Deny
          </u-button>
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
    this.emit('tool-approval', {
      index: this.index,
      isApproved: true,
    });
  }

  handleClickDeny() {
    this.emit('tool-approval', {
      index: this.index,
      isApproved: false,
    });
  }
}