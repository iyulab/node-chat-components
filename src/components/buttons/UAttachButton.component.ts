import { html } from "lit";
import { property, query } from "lit/decorators.js";

import { BaseElement } from "@iyulab/components/dist/components/BaseElement.js";
import { UIcon } from "@iyulab/components/dist/components/icon/UIcon.component.js";
import { styles } from "./UAttachButton.styles.js";

/**
 * 파일 첨부 버튼 컴포넌트입니다.
 */
export class UAttachButton extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-icon': UIcon,
  };

  @query('input[type="file"]') input?: HTMLInputElement;

  /** 첨부 파일 유형 제한, 컴마로 구분된 MIME 타입 문자열 (예: "image/*,application/pdf") */  
  @property({ type: String }) accept?: string;
  /** 다중 파일 선택 가능 여부 */
  @property({ type: Boolean }) multiple: boolean = false;

  render() {
    return html`
      <u-button part="base" 
        variant="borderless"
        @click=${this.handleButtonClick}>
        <u-icon part="icon" 
          lib="internal" 
          name="paperclip"
        ></u-icon>
      </u-button>
      
      <input hidden
        type="file"
        ?multiple=${this.multiple}
        .accept=${this.accept || ''}
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
    this.emit('u-change', { files: Array.from(files) });
    // input 초기화
    target.value = '';
  }
}