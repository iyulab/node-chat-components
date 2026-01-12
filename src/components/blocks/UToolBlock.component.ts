import { html } from "lit";
import { property } from "lit/decorators.js";

import { BaseElement } from "@iyulab/components/dist/components/BaseElement.js";
import { UIcon } from "@iyulab/components/dist/components/icon/UIcon.component.js";
import { USpinner } from "@iyulab/components/dist/components/spinner/USpinner.component.js";
import { UJsonViewer } from "../json-viewer/UJsonViewer.component.js";
import type { JsonNode } from "../json-viewer/UJsonViewer.lib.js";
import { styles } from "./UToolBlock.styles.js";

/**
 * 툴 사용 블록 컴포넌트입니다.
 */
export class UToolBlock extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-icon': UIcon,
    'u-spinner': USpinner,
    'u-json-viewer': UJsonViewer,
  };

  /** 블록 접힘 여부 */
  @property({ type: Boolean, reflect: true }) collapsed: boolean = true;
  /** 로딩 상태 */
  @property({ type: Boolean, reflect: true }) loading: boolean = false;
  /** 헤딩 텍스트 */
  @property({ type: String }) heading?: string;
  /** 입력 데이터 (JSON 문자열) */
  @property({ type: String }) input?: string;
  /** 출력 데이터 (JSON 문자열) */
  @property({ type: String }) output?: string;

  render() {
    return html`
      <div class="header"  @click=${() => this.collapsed = !this.collapsed}>
        ${this.loading
          ? html`<u-spinner></u-spinner>`
          : html`<u-icon lib="internal" name="tools"></u-icon>`}
        <div class="title">
          ${this.heading || 'Tool Usage'}
        </div>
        <u-icon
          lib="internal"
          name=${this.collapsed ? 'plus-lg' : 'dash-lg'}
        ></u-icon>
      </div>

      <div class="body" part="body" scrollable ?hidden=${this.collapsed}>
        <div class="viewer" ?hidden=${!this.input}>
          <u-icon lib="internal" name="chevron-right"></u-icon>
          <u-json-viewer
            .value=${this.parseJson(this.input)}
          ></u-json-viewer>
        </div>
        <div class="viewer" ?hidden=${!this.output}>
          <u-icon lib="internal" name="chevron-right"></u-icon>
          <u-json-viewer
            .value=${this.parseJson(this.output)}
          ></u-json-viewer>
        </div>
      </div>

      <div class="footer" hidden></div>
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
}