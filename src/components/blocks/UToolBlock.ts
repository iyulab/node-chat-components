import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@iyulab/components/dist/components/icon/UIcon.js";
import "@iyulab/components/dist/components/spinner/USpinner.js";
import "./UJsonBlock.js";
import { UElement } from "@iyulab/components/dist/components/UElement.js";
import { jsonAttrConverter } from "@iyulab/components/dist/utilities/converters.js";
import type { JsonNode } from "../../types/JsonNode.js";
import { styles } from "./UToolBlock.styles.js";

/**
 * 툴 사용 블록 컴포넌트입니다.
 */
@customElement("u-tool-block")
export class UToolBlock extends UElement {
  static styles = [ super.styles, styles ];

  /** 로딩 상태 */
  @property({ type: Boolean, reflect: true }) loading: boolean = false;
  /** 블록 접힘 여부 */
  @property({ type: Boolean, reflect: true }) collapsed: boolean = true;
  /** 헤딩 텍스트 */
  @property({ type: String }) title: string = '';
  /** 입력 데이터 (JSON Object) */
  @property({ 
    type: Object, 
    converter: jsonAttrConverter<JsonNode>() 
  }) 
  input?: JsonNode;
  /** 출력 데이터 (JSON Object) */
  @property({ 
    type: Object, 
    converter: jsonAttrConverter<JsonNode>() 
  }) 
  output?: JsonNode;

  render() {
    return html`
      <div class="header"  @click=${() => this.collapsed = !this.collapsed}>
        ${this.loading
          ? html`<u-spinner></u-spinner>`
          : html`<u-icon lib="bootstrap" name="tools"></u-icon>`}
        <div class="title">
          ${this.title || 'Tool Usage'}
        </div>
        <u-icon
          lib="internal"
          name=${this.collapsed ? 'plus-lg' : 'dash-lg'}
        ></u-icon>
      </div>

      <div class="body" part="body" scrollable ?hidden=${this.collapsed}>
        <div class="input-view" ?hidden=${!this.input}>
          <u-json-block
            .value=${this.input || {}}
          ></u-json-block>
        </div>
        <div class="output-view" ?hidden=${!this.output}>
          <u-icon lib="internal" name="chevron-down"></u-icon>
          <u-json-block
            .value=${this.output || {}}
          ></u-json-block>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "u-tool-block": UToolBlock;
  }
}