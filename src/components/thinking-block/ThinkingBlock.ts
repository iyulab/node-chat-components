import { LitElement, PropertyValues, html } from "lit";
import { property, query } from "lit/decorators.js";
import { nothing } from "lit/html.js";
import { styles } from "./ThinkingBlock.styles";

export class UcThinkingBlock extends LitElement {
  static styles = [ styles ];

  @query('.body') bodyEl!: HTMLElement;

  @property({ type: String }) value?: string;
  @property({ type: Boolean, reflect: true }) loading: boolean = false;
  @property({ type: Boolean, reflect: true }) collapsed: boolean = true;

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('value') && this.value && this.loading && this.bodyEl) {
      requestAnimationFrame(() => {
        this.bodyEl.scrollTo({ top: this.bodyEl.scrollHeight, behavior: 'smooth' });
      });
    }
  }

  render() {
    if (!this.value) return nothing;
    
    return html`
      <div class="container">
        <div class="header" @click=${this.toggle}>
          ${this.loading
            ? html`<div class="title">🤔 Thinking <span class="dots"></span></div>`
            : html`<div class="title">💡 Thought</div>
              ${this.collapsed 
              ? html`<uc-icon name="plus"></uc-icon>`
              : html`<uc-icon name="minus"></uc-icon>`}`}
        </div>
        <div class="body">
          ${this.value}
        </div>
      </div>
    `;
  }

  private toggle = () => {
    if (this.loading) return;
    this.collapsed = !this.collapsed;
  }
}