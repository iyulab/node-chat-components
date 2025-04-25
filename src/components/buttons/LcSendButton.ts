import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('lc-send-button')
export class LcSendButton extends LitElement {

  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) loading = false;

  render() {
    return html`
      <lc-button class="send-btn" 
        ?disabled=${this.loading ? false : this.disabled} 
        @click=${this.handleClick}>
        <lc-icon
          name=${this.loading ? 'square-fill' : 'arrow-up'}
        ></lc-icon>
      </lc-button>
    `;
  }

  private handleClick() {
    if (this.disabled) return;

    if (this.loading) {
      this.dispatchEvent(new CustomEvent('stop', {
        bubbles: true,
        composed: true,
      }));
    } else {
      this.dispatchEvent(new CustomEvent('send', {
        bubbles: true,
        composed: true,
      }));
    }
  }

  static styles = css`
    :host {
      display: inline-block;
    }

    lc-button {
      font-size: 12px;
      color: white;
      background-color: black;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
    }
    lc-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;
}