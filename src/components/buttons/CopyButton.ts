import { html } from 'lit';
import { property, state } from 'lit/decorators.js';

import { BaseElement } from '../../internal/BaseElement.js';
import { Button } from '../button/Button.js';
import { Icon } from '../icon/Icon.js';
import { styles } from './CopyButton.styles.js';

export class CopyButton extends BaseElement {
  static dependencies: Record<string, typeof BaseElement> = {
    'uc-button': Button,
    'uc-icon': Icon
  };
  static styles = [ styles ]

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
}