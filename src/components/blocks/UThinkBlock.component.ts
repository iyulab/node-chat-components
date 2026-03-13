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
  /** 컨텐츠 업데이트 시 자동으로 스크롤할지 여부 */
  @property({ type: Boolean, attribute: 'auto-scroll' }) autoScroll: boolean = false;
  /** 추론 컨텐츠의 내용 */
  @property({ type: String }) value?: string;

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('value') && this.autoScroll) {
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
        ?hidden=${this.collapsed}
        @wheel=${this.handleUserInterrupt}
        @touchstart=${this.handleUserInterrupt}>
        <u-marked-block
          .value=${this.value}
        ></u-marked-block>
      </div>
    `;
  }

  /**
   * 컨텐츠 스크롤을 맨 아래로 이동
   * @returns 스크롤 작업이 시작되었는지 여부 (bodyEl이 존재할 때만 true)
   */
  public scrollToBottom(): boolean {
    if (!this.bodyEl) return false;

    requestAnimationFrame(() => {
      this.bodyEl.scrollTo({ 
        top: this.bodyEl.scrollHeight,
        behavior: 'smooth'
      });
    });
    return true;
  }

  /**
   * 사용자의 스크롤 인터럽트 처리
   * 휠이나 터치 입력 시 자동 스크롤 중지
   */
  private handleUserInterrupt = () => {
    if (this.autoScroll) {
      this.autoScroll = false;
    }
  }
}