import { LitElement, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { svg } from "../../internal";

@customElement('uc-icon')
export class UcIcon extends LitElement {
  
  @state() data?: string;
  @property({ type: String }) name?: string;

  protected updated(_changedProperties: any) {
    super.updated(_changedProperties);

    if (_changedProperties.has('name') && this.name) {
      this.data = svg.get(this.name) || '';
    }
  }

  render() {
    const data = this.data?.trim();
    return data?.startsWith('<svg') 
      ? unsafeHTML(data)
      : nothing;
  }
  
  static styles = css`
    :host {
      display: inline-flex;
      font-size: 16px;
      color: inherit;
    }

    svg {
      width: 1em;
      height: 1em;
      fill: currentColor;
    }
  `;
}
