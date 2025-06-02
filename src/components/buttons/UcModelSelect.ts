import { LitElement, html, css, nothing, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { 
  computePosition, 
  autoPlacement, 
  flip, 
  offset, 
  shift } from '@floating-ui/dom';
import type { ModelSummary } from '../../types';

@customElement('uc-model-select')
export class UcModelSelect extends LitElement {

  @query('.selecter') selecterEl!: HTMLElement;
  @query('.list') listEl!: HTMLElement;

  @property({ type: Boolean, reflect: true }) open: boolean = false;
  @property({ type: String }) placeholder: string = "Choose a model";
  @property({ type: Array }) models: ModelSummary[] = [];
  @property({ type: Object }) selectedModel?: ModelSummary;

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('focusout', () => this.open = false);
  }

  disconnectedCallback(): void {
    this.removeEventListener('focusout', () => this.open = false);
    super.disconnectedCallback();
  }

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('open')) {
      this.open ? this.show() : this.hide();
    }
  }

  render() {
    return html`
      <div class="selecter" tabindex="0" @click=${() => this.toggle()}>
        <div class="value">
          ${this.selectedModel?.displayName || this.placeholder}
        </div>
        <uc-icon class="icon"
          name=${this.open ? 'chevron-up' : 'chevron-down'}
        ></uc-icon>
      </div>
      <div class="list" tabindex="0">
        ${repeat(this.models, (i) => i.modelId, (i) => {
          const selected = this.selectedModel?.modelId === i.modelId;
          return html`
            <div class="item" ?selected=${selected} @click=${() => this.select(i)}>
              <div class="display">
                ${i.displayName}
                ${selected ? html`<uc-icon name="check"></uc-icon>` : nothing}
              </div>
              <div class="description">
                ${i.description}
              </div>
            </div>
          `})}
      </div>
    `;
  }

  private toggle = () => {
    this.open = !this.open;
  }

  private select = (model: ModelSummary) => {
    this.selectedModel = model;
    this.dispatchEvent(new CustomEvent('select', { 
      detail: this.selectedModel,
      bubbles: true, composed: true 
    }));
    this.open = false;
  }

  private show = async () => {
    if (!this.open) return;
    await this.compute();
    this.listEl.classList.add('open');
  }

  private hide = async () => {
    if (this.open) return;
    this.listEl.classList.remove('open');

    this.dispatchEvent(new CustomEvent('popup', {
      bubbles: true,
      composed: true,
    }));
  }

  private compute = async () => {
    const { x, y } = await computePosition(this, this.listEl, {
      middleware: [
        flip(),
        shift(),
        offset(),
        autoPlacement({
          allowedPlacements: ['top-start', 'bottom-start'],
        }),
      ],
    });

    Object.assign(this.listEl.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
  }

  static styles = css`
    :host {
      position: relative;
      display: block;
      background-color: var(--uc-background-color-0);
      border: 1px solid var(--uc-border-color-low);
      border-radius: 8px;
      padding: 8px 12px;
      box-sizing: border-box;
    }

    .selecter {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      font-size: 14px;
      line-height: 16px;
      gap: 8px;
    }

    /* 리스트 스타일 */
    .list {
      position: absolute;
      width: max-content;
      top: 0;
      left: 0;

      display: flex;
      flex-direction: column;
      visibility: hidden;
      opacity: 0;

      border-radius: 8px;
      border: 1px solid var(--uc-border-color-low);
      background-color: var(--uc-background-color-0);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 1000;

      max-height: 260px;
      overflow: auto;
      box-sizing: border-box;

      scrollbar-color: var(--uc-background-color-800) transparent;
      scrollbar-width: thin;
    }
    .list.open {
      visibility: visible;
      opacity: 1;
    }

    .item {
      position: relative;
      padding: 6px 12px;
      display: flex;
      flex-direction: column;
      transition: background-color 0.2s, color 0.2s;
      box-sizing: border-box;
      cursor: pointer;
      
      .display {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        line-height: 20px;
        font-weight: 600;
      }

      .description {
        font-size: 12px;
        line-height: 20px;
        font-weight: 300;
        opacity: 0.6;
      }
    }
    .item[selected] {
      color: var(--uc-blue-color-500);
    }
    .item:hover {
      background-color: var(--uc-background-color-300);
    }
  `;
}
