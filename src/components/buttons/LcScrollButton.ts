import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('lc-scroll-button')
export class LcScrollButton extends LitElement {
  @property({ type: String }) direction: 'up' | 'down' | 'left' | 'right' = 'up';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) circle = true;

  render() {
    return html`
      <chat-icon class="scroll-btn"
        name="arrow-down"
      ></chat-icon>
    `;
  }

  private _handleClick(e: Event) {
    if (!this.disabled) {
      this.dispatchEvent(new CustomEvent('arrow-click', {
        bubbles: true,
        composed: true,
        detail: { direction: this.direction }
      }));
    }
  }

  private _getArrowIcon() {
    switch(this.direction) {
      case 'up': return html`↑`;
      case 'down': return html`↓`;
      case 'left': return html`←`;
      case 'right': return html`→`;
      default: return html`↑`;
    }
  }

  static styles = css`
    :host {
      display: inline-block;
    }
    
    .scroll-btn {
      position: relative;
      width: var(--scroll-area-height);
      height: var(--scroll-area-height);
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0.5;
      color: var(--hs-text-color);
      background-color: var(--hs-background-color);
      border: 1px solid var(--hs-border-color);
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      transition: opacity 0.3s ease;
      cursor: pointer;
    }
    .scroll-btn:hover {
      opacity: 1;
    }
    .scroll-btn:active {
      transform: scale(0.9);
    }
  `;
}
