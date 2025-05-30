import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('uc-copy-button')
export class UcCopyButton extends LitElement {
  @state() status: 'idle' | 'copied' = 'idle'; // Copy status

  @property({ type: String }) value = ''; // Text to copy
  @property({ type: Number }) delay = 1_000; // Delay in milliseconds

  render() {
    return html`
      <uc-button 
        tooltip="Copy"
        tooltipPosition="bottom"
        @click=${this.copy}>
        <uc-icon
          name=${this.status === 'copied' ? 'check' : 'copy'}
        ></uc-icon>
      </uc-button>
    `;
  }

  public copy = async () => {
    if (!this.value) return;
    if (this.status === 'copied') return;

    if (navigator.clipboard) {
      // If the Clipboard API is available, use it
      await navigator.clipboard.writeText(this.value);
    } else {
      // Fallback for older browsers
      const area = document.createElement('textarea');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      area.style.pointerEvents = 'none';
      area.value = this.value;
      document.body.appendChild(area);
      area.focus();
      area.select();

      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Failed to copy: ', err);
      } finally {
        document.body.removeChild(area);
      }
    }

    this.status = 'copied';
    await new Promise((resolve) => setTimeout(resolve, this.delay));
    this.status = 'idle';
  }

  static styles = css`
    :host {
      display: inline-flex;
    }

    uc-button {
      border: none;
    }

    uc-icon {
      font-size: 14px;
      color: var(--uc-text-color-medium);
    }
  `;
}