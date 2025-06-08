import { html, nothing, PropertyValues } from 'lit';
import { property, query } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { computePosition, autoPlacement, flip, offset, shift } from '@floating-ui/dom';

import { BaseElement } from '../../internal/BaseElement.js';
import { Icon } from '../icon/Icon.js';
import { styles } from './ModelSelect.styles.js';
import type { ModelSummary } from './ModelSelect.types.js';

export class ModelSelect extends BaseElement {
  static dependencies: Record<string, typeof BaseElement> = {
    'uc-icon': Icon
  };
  static styles = [ styles ];

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
      if (this.open) {
        this.show();
      } else {
        this.hide();
      }
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
}
