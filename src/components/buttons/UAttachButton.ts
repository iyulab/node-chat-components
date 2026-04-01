import { html } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import "@iyulab/components/dist/components/icon/UIcon.js";
import "@iyulab/components/dist/components/button/UButton.js";
import "@iyulab/components/dist/components/tooltip/UTooltip.js";
import { UElement } from "@iyulab/components/dist/components/UElement.js";
import { AttachEventDetail } from "../../events/AttachEvent.js";
import { styles } from "./UAttachButton.styles.js";

/**
 * 파일 첨부 버튼 컴포넌트입니다.
 */
@customElement("u-attach-button")
export class UAttachButton extends UElement {
  static styles = [ super.styles, styles ];

  /** 첨부 파일 유형 제한, 컴마로 구분된 MIME 타입 문자열 (예: "image/*,application/pdf") */  
  @property({ type: String }) accept?: string;
  /** 다중 파일 선택 가능 여부 */
  @property({ type: Boolean }) multiple: boolean = false;

  @query('input[type="file"]') input?: HTMLInputElement;

  render() {
    return html`
      <u-button part="base"
        variant="ghost"
        @click=${this.handleButtonClick}>
        <u-icon part="icon" 
          lib="bootstrap" 
          name="paperclip"
        ></u-icon>
      </u-button>

      <u-tooltip for="u-button" placement="bottom" distance="8">
        <slot></slot>
      </u-tooltip>
      
      <input 
        hidden
        type="file"
        ?multiple=${this.multiple}
        .accept=${this.accept || '*'}
        @change=${this.handleInputChange}
      />
    `;
  }

  /**
   * 버튼 클릭 핸들러
   */
  private handleButtonClick = () => {
    if (!this.input) return;
    this.input.click();
  }

  /**
   * 파일 선택 이벤트 핸들러
   */
  private handleInputChange = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) return;

    // 파일 선택 이벤트 디스패치
    this.fire<AttachEventDetail>('attach', { 
      detail: { files: Array.from(files) } 
    });
    
    // input 초기화
    target.value = '';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "u-attach-button": UAttachButton;
  }
}