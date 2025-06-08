import { html } from 'lit';
import { property } from 'lit/decorators.js';

import { BaseElement } from '../../internal/BaseElement.js';
import { Button } from '../button/Button.js';
import { Icon } from '../icon/Icon.js';
import { styles } from './ClearButton.styles.js';

export class ClearButton extends BaseElement {
  static dependencies: Record<string, typeof BaseElement> = {
    'uc-button': Button,
    'uc-icon': Icon
  };
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
