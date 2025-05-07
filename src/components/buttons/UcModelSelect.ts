import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { 
  computePosition, 
  autoPlacement, 
  flip, 
  offset, 
  shift } from '@floating-ui/dom';
import type { ModelDescriptor } from '../../types';
import { repeat } from 'lit/directives/repeat.js';

@customElement('uc-model-select')
export class UcModelSelect extends LitElement {

  @query('.selecter') selecterEl!: HTMLElement;
  @query('.list') listEl!: HTMLElement;

  @property({ type: Boolean, reflect: true }) open: boolean = false;

  @property({ type: Array }) models: ModelDescriptor[] = [];
  @property({ type: Object }) defaultModel?: ModelDescriptor;
  @property({ type: Object }) selectedModel?: ModelDescriptor;

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('focusin', this.handleClickInside);
    this.addEventListener('focusout', this.handleClickOutside);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('focusin', this.handleClickInside);
    this.removeEventListener('focusout', this.handleClickOutside);
  }

  render() {
    return html`
      <div class="selecter"
        tabindex="0"
        @click=${async () => {
          this.listEl.classList.toggle('show');
          if (this.listEl.classList.contains('show')) {
            await this.compute();
            this.listEl.style.display = 'block';
          } else {
            this.listEl.style.display = 'none';
            this.listEl.style.left = '0px';
            this.listEl.style.top = '0px';
          }
        }}>

        ${this.selectedModel
          ? html`<span class="selected-model">${this.selectedModel.display}</span>`
          : html`<span class="placeholder">Select a model</span>`}

      </div>
      <div class="list">
        ${repeat(this.models, (i) => i.model, (i) => html`
          <div class="item" ?selected=${this.selectedModel?.model === i.model}
            @click=${() => {
              this.selectedModel = i;
              this.dispatchSelectEvent(i);
              this.listEl.classList.remove('show');
              this.listEl.style.display = 'none';
            }}>
            <div class="display">${i.display}</div>
            <div class="description">${i.description}</div>
          </div>
        `)}
      </div>
    `;
  }

  private handleClickOutside = async (e: FocusEvent) => {
    console.log("clicked outside", e);
    if (!this.open) return;
    this.open = false;
  }

  private handleClickInside = async (e: FocusEvent) => {
    console.log("clicked inside", e);
    if (this.open) return;

    await this.compute();
    this.open = true;
  }

  private compute = async () => {
    const { x, y } = await computePosition(this.selecterEl, this.listEl, {
      middleware: [
        flip(),
        shift(),
        offset(4),
        autoPlacement({
          allowedPlacements: ['top-start', 'bottom-start'],
          boundary: this.selecterEl,
        }),
      ],
    });

    Object.assign(this.listEl.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
  }

  private dispatchSelectEvent = (model: ModelDescriptor) => {
    this.selectedModel = model;
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: this.selectedModel,
        bubbles: true,
        composed: true,
      })
    );
  }

  private dispatchPopupEvent = () => {
    this.dispatchEvent(
      new CustomEvent('popup', {
        bubbles: true,
        composed: true,
      })
    );
  }

  static styles = css`
    :host {
      display: block;
    }
    :host([open]) .list {
      display: block;
    }

     /* 선택자 전체 컨테이너 */
    .selecter {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      min-width: 200px;
      background-color: var(--uc-bg-color, #fff);
      border: 1px solid #ccc;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      transition: border-color 0.3s, box-shadow 0.3s;
    }

    /* 선택자에 포커스 또는 활성 상태 */
    .selecter:focus,
    .selecter:hover {
      border-color: #66afe9;
      box-shadow: 0 0 5px rgba(102, 175, 233, 0.6);
      outline: none;
    }

    /* 선택된 모델 또는 플레이스 홀더 */
    .selected-model {
      color: #333;
      font-weight: 600;
    }
    .placeholder {
      color: #999;
    }

    /* 리스트 스타일 */
    .list {
      display: none; /* 자바스크립트 로직으로 표시/숨김 처리 */
      position: absolute;
      margin-top: 4px;
      min-width: 100%;
      max-height: 250px;
      overflow-y: auto;
      background-color: var(--uc-bg-color, #fff);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      padding: 0.5rem 0;
    }

    /* 리스트 항목 */
    .item {
      padding: 0.75rem 1.2rem;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      transition: background-color 0.2s, color 0.2s;
    }

    /* 선택된 항목 하이라이트 */
    .item[selected] {
      background-color: #f0f8ff;
      font-weight: bold;
    }

    /* 항목 hover 효과 */
    .item:hover {
      background-color: #e6f7ff;
    }

    /* 항목 내부 텍스트 */
    .display {
      font-size: 1rem;
      color: #222;
    }
    .description {
      font-size: 0.85rem;
      color: #666;
      margin-top: 0.2rem;
    }
  `;
}