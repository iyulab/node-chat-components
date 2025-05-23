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

    // Copy the text to clipboard
    await navigator.clipboard.writeText(this.value);

    // Change the status to 'copied'
    this.status = 'copied';

    // Wait for the specified delay
    await new Promise((resolve) => setTimeout(resolve, this.delay));

    // Reset the status to 'idle'
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
      font-size: 12px;
      color: var(--uc-text-color-medium);
    }
  `;
}