import { PropertyValues, html } from "lit";
import { property, query } from "lit/decorators.js";

import { UElement } from "@iyulab/components/dist/components/UElement.js";
import { UIcon } from "@iyulab/components/dist/components/icon/UIcon.component.js";
import { UMarkedBlock } from "./UMarkedBlock.component.js";
import { styles } from "./UThinkBlock.styles.js";

/**
 * 추론 내용을 표시하는 블록입니다.
 * 로딩 중일 때는 "Thinking..." 메시지를 표시하고, 내용 펼치기/접기 기능을 제공합니다.
 */
export class UThinkBlock extends UElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof UElement> = {
    "u-icon": UIcon,
    "u-marked-block": UMarkedBlock
  };

  @query('.body') bodyEl!: HTMLDivElement;

  /** 컨텐츠가 로딩 중인지 여부 */
  @property({ type: Boolean, reflect: true }) loading: boolean = false;
  /** 컨텐츠가 접혀있는지 여부 */
  @property({ type: Boolean, reflect: true }) collapsed: boolean = true;
  /** 추론 컨텐츠의 내용 */
  @property({ type: String }) value?: string;

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('value') && this.value) {
      this.scrollToBottom();
    }
  }

  render() {
    return html`
      <div class="header" part="header"
        @click=${() => this.collapsed = !this.collapsed}>
        <u-icon class="prefix-icon"
          ?loading=${this.loading}
          lib="internal"
          name="lightbulb-fill"
        ></u-icon>
        <span class="title">
          ${this.loading ? "Thinking..." : "Thought"}
        </span>
        <u-icon class="suffix-icon"
          lib="internal" 
          name=${this.collapsed ? "plus-lg" : "dash-lg"}
        ></u-icon>
      </div>
      
      <div class="body" part="body" scrollable 
        ?hidden=${this.collapsed}>
        <u-marked-block
          .value=${this.value}
        ></u-marked-block>
      </div>
    `;
  }

  /**
   * 컨텐츠가 로딩 중일 때, 스크롤을 맨 아래로 이동
   */
  private scrollToBottom = () => {
    if (!this.bodyEl) return;

    requestAnimationFrame(() => {
      this.bodyEl.scrollTo({ 
        top: this.bodyEl.scrollHeight,
        behavior: 'smooth'
      });
    });
  }
}