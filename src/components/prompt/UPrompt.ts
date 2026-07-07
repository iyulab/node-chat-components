import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import "@iyulab/components/dist/components/icon/UIcon.js";
import "@iyulab/components/dist/components/button/UButton.js";
import { RemoveEvent } from "@iyulab/components/dist/events/RemoveEvent.js";
import { UElement } from "@iyulab/components/dist/components/UElement.js";
import "../blocks/UFileBlock.js";
import { UTextBlock } from "../blocks/UTextBlock.js";
import type { FileBlockItem } from "../../types/BlockItem.js";
import { StopEventDetail } from "../../events/StopEvent.js";
import { SendEventDetail } from "../../events/SendEvent.js";
import { styles } from "./UPrompt.styles.js";

/**
 * 채팅 입력 컴포넌트입니다.
 * 텍스트 입력 영역과 우측에 액션 버튼을 배치할 수 있는 슬롯을 제공합니다.
 */
@customElement("u-prompt")
export class UPrompt extends UElement {
  static styles = [ super.styles, styles ];

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
  /** 입력 첨부 파일 목록 */
  @property({ type: Array }) files?: FileBlockItem[];

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('tabindex', '0');
  }

  render() {
    return html`
      <slot name="header"></slot>

      <div class="files" part="files"
        ?hidden=${!this.files || this.files.length === 0}>
        ${repeat(this.files || [], (_, i) => i, (file, index) => html`
          <u-file-block
            data-index=${index}
            .removable=${true}
            .status=${file.status}
            .name=${file.name}
            .type=${file.mimeType}
            .size=${file.size}
            @remove=${this.handleRemoveFile}
          ></u-file-block>
        `)}
      </div>

      <u-text-block class="input" part="input"
        .editable=${true}
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
            lib="bootstrap"
            name=${this.loading ? 'stop-circle' : 'arrow-up'}
          ></u-icon>
        </u-button>
      </div>
      
      <slot name="footer"></slot>
    `;
  }

  /**
   * 입력된 텍스트와 첨부 파일을 제출하거나, 로딩 중인 경우 취소 이벤트를 발생시킵니다.
   * 텍스트 또는 첨부 파일이 없는 경우에는 아무런 동작도 하지 않습니다.
   */
  public submit() {
    if (this.loading) {
      const stopDetail: StopEventDetail = {};
      this.fire<StopEventDetail>('stop', { detail: stopDetail });
      return;
    }

    const hasValue = this.value && this.value.trim() !== '';
    const hasFiles = this.files && this.files.length > 0;

    if (hasValue || hasFiles) {
      const sendDetail: SendEventDetail = {
        value: this.value?.trim() ?? '',
        files: this.files ? [...this.files] : undefined,
      };
      this.fire<SendEventDetail>('send', { detail: sendDetail });
    }
  }

  private handleRemoveFile(e: RemoveEvent) {
    e.stopPropagation();
    const index = (e.target as HTMLElement).dataset.index;
    
    if (index !== undefined && this.files) {
      this.files = this.files.filter((_, i) => i !== Number(index));
      this.relay(e);
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
      this.submit();
    }
  }

  private handleSendButtonClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.submit();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "u-prompt": UPrompt;
  }
}