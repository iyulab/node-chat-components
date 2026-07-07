import { html, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { UElement } from "@iyulab/components/dist/components/UElement.js";
import { styles } from "./UTextBlock.styles.js";

/**
 * 텍스트를 표시하거나 편집할 수 있는 블록 컴포넌트입니다.
 * 
 * @event input - 텍스트가 변경될 때 발생하는 이벤트입니다. 이벤트의 `data` 속성에 변경된 텍스트가 포함됩니다.
 */
@customElement("u-text-block")
export class UTextBlock extends UElement {
  static styles = [ super.styles, styles ];

  /** 편집 가능 여부 */
  @property({ type: Boolean, reflect: true }) editable: boolean = false;
  /** 스펠체크 여부 */
  @property({ type: Boolean }) spellcheck: boolean = false;
  /** 플레이스홀더 텍스트 */
  @property({ type: String }) placeholder?: string;
  /** 최소 행 수, 기본값은 1 */
  @property({ type: Number }) minRows: number = 1;
  /** 최대 행 수 */
  @property({ type: Number }) maxRows?: number;
  /** 텍스트 블록의 내용 */
  @property({ type: String }) value?: string;

  @query('textarea') textareaEl!: HTMLTextAreaElement;
  @query('pre') preEl!: HTMLPreElement;

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    
    if (changedProperties.has('minRows') && this.minRows > 0) {
      const lineHeight = parseFloat(getComputedStyle(this.preEl).lineHeight);
      this.preEl.style.minHeight = `${this.minRows * lineHeight}px`;
    }
    if (changedProperties.has('maxRows') && this.maxRows && this.maxRows > 0 && this.maxRows > this.minRows) {
      const lineHeight = parseFloat(getComputedStyle(this.preEl).lineHeight);
      this.preEl.style.maxHeight = `${this.maxRows * lineHeight}px`;
    }
    if (changedProperties.has('editable') && this.editable) {
      requestAnimationFrame(() => {
        this.textareaEl.focus();
        this.textareaEl.setSelectionRange(this.value?.length || 0, this.value?.length || 0);
      });
    }
  }

  render() {
    return html`
      <div class="container">
        <textarea
          name="message"
          placeholder=${this.placeholder || ''}
          spellcheck=${this.spellcheck}
          .readOnly=${!this.editable}
          .value=${this.value || ''}
          @input=${this.updateValueFrom}
        ></textarea>
        <pre
          .textContent=${this.normalizeValue(this.value)}
        ></pre>
      </div>
    `;
  }

  /**
   * textarea에 포커스를 줍니다.
   */
  public override focus(options?: FocusOptions): void {
    this.textareaEl.focus(options);
  }

  /**
   * 텍스트 입력시 value를 업데이트하고 이벤트를 재전파합니다.
   */
  private updateValueFrom = (event: InputEvent) => {
    // event.preventDefault();
    event.stopPropagation();
    this.value = this.textareaEl.value;

    // 값 변경 이벤트 재전파
    this.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      composed: true,
      cancelable: true,
      data: this.value,
      inputType: event.inputType,
      isComposing: event.isComposing,
      dataTransfer: event.dataTransfer,
      detail: event.detail,
      targetRanges: event.getTargetRanges(),
      view: event.view
    }));
  }

  /**
   * pre 엘리먼트에 주입될 값을 정규화합니다.
   */
  private normalizeValue(value?: string) {
    if (!value) return '\u200B'; // 빈 값일 경우 zero-width space 삽입

    // 마지막 문자가 줄바꿈이면 zero-width space 추가
    if (value.endsWith('\n')) {
      return value + '\u200B';
    }
    
    return value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "u-text-block": UTextBlock;
  }
}