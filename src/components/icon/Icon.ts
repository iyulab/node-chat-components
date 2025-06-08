import { nothing, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { BaseElement } from "../../internal/BaseElement.js";
import { lib } from "./Icon.lib.js";
import { styles } from "./Icon.styles.js";

export class Icon extends BaseElement {
  static styles = [ styles ]

  @state() html?: string;
  @property({ type: String }) name?: string;

  protected willUpdate(_changedProperties: PropertyValues) {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has('name') && this.name) {
      this.html = lib.get(this.name!);
    }
  }

  render() {
    return this.html 
      ? unsafeHTML(this.html.trim())
      : nothing;
  }
}
