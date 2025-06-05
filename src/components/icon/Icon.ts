import { LitElement, nothing, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { styles } from "./Icon.styles";
import { lib } from "./Icon.lib";

export class UcIcon extends LitElement {
  static styles = [ styles ]

  @state() html?: string;
  @property({ type: String }) name?: string;

  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);

    if (_changedProperties.has('name') && this.name) {
      this.html = lib.get(this.name) || '';
    }
  }

  render() {
    return unsafeHTML(this.html?.trim() || '') || nothing;
  }
}
