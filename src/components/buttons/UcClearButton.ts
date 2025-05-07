import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('uc-clear-button')
export class UcClearButton extends LitElement {

  @property({ type: Boolean }) disabled: boolean = false;
  @property({ type: Boolean }) loading: boolean = false;

  render() {
    return html`
      <uc-button ?disabled=${this.disabled} ?loading=${this.loading} tooltip="Clear">
        <uc-icon name="clear"></uc-icon>
      </uc-button>
    `;
  }

  static styles = css`
    :host {
      display: inline-block;
      padding: 0;
    }

    uc-icon {
      font-size: 21px;
    }
  `;
}
