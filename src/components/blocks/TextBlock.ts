import { html, nothing } from "lit";
import { property } from "lit/decorators.js";

import { BaseElement } from "../../internal/BaseElement.js";
import { styles } from "./TextBlock.styles.js";

export class TextBlock extends BaseElement {
  static styles = [ styles ];

  @property({ type: String })
  value?: string;

  render() {
    if (!this.value) return nothing;
    
    return html`${this.value}`;
  }
}
