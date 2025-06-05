import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { styles } from "./TextBlock.styles";

export class UcTextBlock extends LitElement {
  static styles = [ styles ];

  @property({ type: String })
  value?: string;

  render() {
    if (!this.value) return nothing;
    
    return html`${this.value}`;
  }
}
