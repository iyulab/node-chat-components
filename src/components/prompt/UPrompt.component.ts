import { html } from "lit";
import { property } from "lit/decorators.js";

import { BaseElement } from "@iyulab/components/dist/components/BaseElement.js";
import { UIcon } from "@iyulab/components/dist/components/icon/UIcon.component.js";
import { UButton } from "@iyulab/components/dist/components/button/UButton.component.js";
import { UTextBlock } from "../blocks/UTextBlock.component.js";
import { styles } from "./UPrompt.styles.js";

/**
 * 채팅 입력 컴포넌트입니다.
 * 텍스트 입력 영역과 우측에 액션 버튼을 배치할 수 있는 슬롯을 제공합니다.
 */
export class UPrompt extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {
    'u-icon': UIcon,
    'u-button': UButton,
    'u-text-block': UTextBlock,
  };

  /** 로딩 상태 여부 */
  @property({ type: Boolean, reflect: true }) loading: boolean = false;
  /** 최소 행 수 */
  @property({ type: Number }) minRows: number = 1;
  /** 최대 행 수 */
  @property({ type: Number }) maxRows: number = 10;
  /** 입력 필드의 플레이스홀더 텍스트 */
  @property({ type: String }) placeholder?: string;
  /** 입력 필드의 값 */
  @property({ type: String }) value?: string;

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('tabindex', '0');
  }

  render() {
    return html`
      <slot name="header"></slot>

      <u-text-block part="input"
        editable
        .minRows=${this.minRows}
        .maxRows=${this.maxRows}
        .value=${this.value}
        .placeholder=${this.placeholder}
        @input=${this.handleTextBlockInput}
        @keydown=${this.handleTextBlockKeydown}
      ></u-text-block>
      
      <div class="control" part="control">
        <slot name="left-actions"></slot>
        <div style="flex: 1;"></div>
        <slot name="right-actions"></slot>
        
        <u-button class="send-btn" part="send-btn"
          ?disabled=${!this.loading && !this.value}
          @click=${this.handleSendButtonClick}>
          <u-icon
            lib="internal"
            name=${this.loading ? 'stop-circle' : 'arrow-up'}
          ></u-icon>
        </u-button>
      </div>
      
      <slot name="footer"></slot>
    `;
  }

  public send() {
    const value = this.value?.trim();

    if (this.loading) {
      this.emit('u-cancel');
    } else if (value) {
      this.emit('u-submit', { value: this.value });
      this.value = '';
    } else {
      // nothing to do
    }
  }

  private handleTextBlockInput(e: InputEvent) {
    e.preventDefault();
    const target = e.target as UTextBlock;
    this.value = target.value;
  }

  private handleTextBlockKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.send();
    }
  }

  private handleSendButtonClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.send();
  }
}
