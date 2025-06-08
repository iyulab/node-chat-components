import { PropertyValues, html } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from 'lit/directives/if-defined.js';

import { BaseElement } from "../../internal/BaseElement.js";
import { Button } from "../button/Button.js";
import { Icon } from "../icon/Icon.js";
import { styles } from "./MessageInput.styles.js";

export class MessageInput extends BaseElement {
  static dependencies: Record<string, typeof BaseElement> = {
    'uc-button': Button,
    'uc-icon': Icon,
  };
  static styles = [ styles ];

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
          
          <uc-button class="send-btn"
            ?disabled=${this.loading ? false : this.disabled}
            @click=${this.loading ? this.dispatchStopEvent : this.dispatchSendEvent}>
            <uc-icon
              name=${this.loading ? 'square-fill' : 'arrow-up'}
            ></uc-icon>
          </uc-button>
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
}