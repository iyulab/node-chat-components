import { html, nothing } from "lit";
import { property } from "lit/decorators.js";

import { BaseElement } from "@iyulab/components/dist/components/BaseElement.js";
import { UIcon } from "@iyulab/components/dist/components/icon/UIcon.component.js";
import { UTooltip } from "@iyulab/components/dist/components/tooltip/UTooltip.component.js";
import { UButton } from "@iyulab/components/dist/components/button/UButton.component.js";
import { USpinner } from "@iyulab/components/dist/components/spinner/USpinner.component.js";
import { UJsonViewer } from "../json-viewer/UJsonViewer.component.js";
import type { JsonNode } from "../json-viewer/UJsonViewer.lib.js";
import type { ToolBlockStatus } from "../message/UMessage.types.js";
import { styles } from "./UToolBlock.styles.js";

export class UToolBlock extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-icon': UIcon,
    'u-tooltip': UTooltip,
    'u-button': UButton,
    'u-spinner': USpinner,
    'u-json-viewer': UJsonViewer,
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
            ? html`<u-icon lib="internal" name="eye"></u-icon>`
            : this.status === 'inProgress'
            ? html`<u-spinner></u-spinner>`
            : this.status === 'success'
            ? html`<u-icon lib="internal" name="check-lg"></u-icon>`
            : this.status === 'failure'
            ? html`<u-icon lib="internal" name="x-lg"></u-icon>`
            : nothing}
          <div class="display">
            Tool Call [${this.name}]
          </div>
          <u-icon
            lib="internal"
            name=${this.collapsed ? 'plus-lg' : 'dash-lg'}
          ></u-icon>
        </div>

        <div class="body" ?hidden=${this.collapsed}>
          <div class="viewer" ?hidden=${!this.input}>
            <div class="label">
              <u-icon lib="internal" name="chevron-right"></u-icon>
              <u-tooltip placement="left">Input</u-tooltip>
            </div>
            <u-json-viewer
              .value=${this.parseJson(this.input)}
            ></u-json-viewer>
          </div>
          <div class="viewer" ?hidden=${!this.output}>
            <div class="label">
              <u-icon lib="internal" name="chevron-right"></u-icon>
              <u-tooltip placement="left">Output</u-tooltip>
            </div>
            <u-json-viewer
              .value=${this.parseJson(this.output)}
            ></u-json-viewer>
          </div>
        </div>

        <div class="footer" ?hidden=${this.status !== 'paused'}>
          <u-button @click=${this.handleClickConfirm}>
            <u-icon slot="prefix" lib="internal" name="check-lg"></u-icon>
            Confirm
          </u-button>
          <u-button @click=${this.handleClickDeny}>
            <u-icon slot="prefix" lib="internal" name="x-lg"></u-icon>
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