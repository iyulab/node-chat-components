import { LitElement, PropertyValues, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from 'lit/directives/if-defined.js';

@customElement('message-input')
export class MessageInput extends LitElement {

  @property({ type: String, reflect: true }) placeholder?: string;
  @property({ type: Number, attribute: "min-rows", reflect: true }) minRows?: number;
  @property({ type: Number, attribute: "max-rows", reflect: true }) maxRows?: number;
  @property({ type: Boolean, reflect: true }) disabled: boolean = true;
  @property({ type: Boolean, reflect: true }) loading: boolean = false;
  @property({ type: String, reflect: true }) value = '';

  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);
    
    if (_changedProperties.has('minRows') && this.minRows) {
      this.style.setProperty('--min-rows', `${this.minRows}`);
    }
    if (_changedProperties.has('maxRows') && this.maxRows) {
      this.style.setProperty('--max-rows', `${this.maxRows}`);
    }
  }

  render() {
    return html`
      <div class="container">
        <!-- Input -->
        <div class="input-area">
          <textarea
            spellcheck="false"
            placeholder=${ifDefined(this.placeholder)}
            rows=${ifDefined(this.minRows)}
            .value=${this.value}
            @input=${this.handleInput}
            @keydown=${this.handleKeydown}
          ></textarea>
          <div class="filler">${this.value}</div>
        </div>

        <!-- Button Control -->
        <div class="control-area">
          <slot></slot>

          <div class="flex"></div>
          
          <lc-button class="send-btn"
            ?disabled=${this.loading ? false : this.disabled}
            @click=${this.loading ? this.dispatchStopEvent : this.dispatchSendEvent}>
            <lc-icon
              name=${this.loading ? 'square-fill' : 'arrow-up'}
            ></lc-icon>
          </lc-button>
        </div>
      </div>
    `;
  }

  private handleInput = (event: InputEvent) => {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.disabled = !target.value.trim();
  }

  private handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (this.loading) return;
      
      this.dispatchSendEvent();
    }
  }

  private dispatchSendEvent = () => {
    console.log('dispatchSendEvent', this.loading);
    if (this.loading) return;

    const value = this.value.trim();
    if (!value) return;
    
    this.dispatchEvent(new CustomEvent('send', {
      bubbles: true,
      composed: true,
      detail: value,
    }));

    this.value = '';
    this.disabled = !this.value.trim();
  }

  private dispatchStopEvent = () => {
    this.dispatchEvent(new CustomEvent('stop', {
      bubbles: true,
      composed: true,
    }));
  }

  static styles = css`
    :host {
      display: block;
      font-size: 16px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      
      line-height: 1.5;
      --min-rows: 2;
      --max-rows: 10;
    }

    .container {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 16px 16px;
      box-sizing: border-box;
      border: 1px solid var(--hs-border-color);
      border-radius: 16px;
      background-color: var(--hs-background-color);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .input-area {
      position: relative;
      box-sizing: border-box;
      max-height: calc(var(--max-rows) * 1.5em);

      textarea {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        padding: 0;
        margin: 0;
        border: none;
        resize: none;
        outline: none;
        color: currentColor;
        background-color: transparent;
        font-size: inherit;
        line-height: inherit;
        font-family: inherit;
        overflow: auto;
      }

      .filler {
        min-height: calc(var(--min-rows) * 1.5em);
        display: block;
        visibility: hidden;
        pointer-events: none;
        font-size: inherit;
        line-height: inherit;
        word-break: break-word;
        white-space: pre-wrap;
      }
    }

    .control-area {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 8px;

      .flex {
        flex: 1;
      }

      .send-btn {
        font-size: 12px;
        color: white;
        background-color: black;
      }
    }
  `;
}