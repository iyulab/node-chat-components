import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { styles } from './ClearButton.styles';

export class UcClearButton extends LitElement {
  static styles = [ styles ]

  @property({ type: Boolean }) disabled: boolean = false;
  @property({ type: Boolean }) loading: boolean = false;

  render() {
    return html`
      <uc-button ?disabled=${this.disabled} ?loading=${this.loading} tooltip="Clear">
        <uc-icon name="clear"></uc-icon>
      </uc-button>
    `;
  }
}
