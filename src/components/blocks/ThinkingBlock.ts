import { PropertyValues, html } from "lit";
import { property, query } from "lit/decorators.js";
import { nothing } from "lit/html.js";

import { BaseElement } from "../../internal/BaseElement.js";
import { Icon } from "../icon/Icon.js";
import { styles } from "./ThinkingBlock.styles.js";

/**
 * 추론 내용을 표시하는 블록입니다.
 * 로딩 중일 때는 "Thinking..." 메시지를 표시하고, 내용 펼치기/접기 기능을 제공합니다.
 */
export class ThinkingBlock extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    "uc-icon": Icon
  };

  @query('.body') bodyEl!: HTMLElement;

  /** 컨텐츠가 로딩 중인지 여부 */
  @property({ type: Boolean, reflect: true }) loading: boolean = false;
  /** 컨텐츠가 접혀있는지 여부 */
  @property({ type: Boolean }) collapsed: boolean = true;
  /** 추론 컨텐츠의 내용 */
  @property({ type: String }) value?: string;

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('value') && this.loading) {
      this.scrollBodyContent();
    }
  }

  render() {
    if (!this.value) return nothing;
    
    return html`
      <div class="container">
        <div class="header" @click=${this.toggleCollapsed}>
          ${this.loading
            ? html`<div class="title dots">🤔 Thinking</div>`
            : html`<div class="title">💡 Thought</div>
          ${this.collapsed
            ? html`<uc-icon name="plus"></uc-icon>`
            : html`<uc-icon name="minus"></uc-icon>`}`}
        </div>
        <div class="body scroll" ?collapsed=${!this.loading && this.collapsed}>
          ${this.value}
        </div>
      </div>
    `;
  }

  /**
   * 컨텐츠 접기/펼치기 토글
   */
  private toggleCollapsed = () => {
    if (this.loading) return;
    this.collapsed = !this.collapsed;
  }

  /**
   * 컨텐츠가 로딩 중일 때, 스크롤을 맨 아래로 이동
   */
  private scrollBodyContent = () => {
    if (!this.bodyEl) return;
    requestAnimationFrame(() => {
      this.bodyEl.scrollTo({ 
        top: this.bodyEl.scrollHeight,
        behavior: 'smooth'
      });
    });
  }
}