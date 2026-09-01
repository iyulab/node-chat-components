import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "@iyulab/components/dist/components/icon/UIcon.js";
import "@iyulab/components/dist/components/button/UButton.js";
import { RemoveEventDetail } from "@iyulab/components/dist/events/RemoveEvent.js";
import { UElement } from "@iyulab/components/dist/components/UElement.js";
import "../../utilities/icons.js";
import { messages } from "../../utilities/messages.js";
import { styles } from "./UFileBlock.styles.js";

/**
 * 단일 파일을 표시하는 블록 컴포넌트입니다.
 * 이미지/비디오는 실제 미리보기를, 그 외 타입은 아이콘을 썸네일로 보여주며
 * 미리보기가 가능한 경우 클릭 시 오버레이로 원본을 확인할 수 있습니다.
 */
@customElement("u-file-block")
export class UFileBlock extends UElement {
  static styles = [super.styles, styles];

  /** 삭제 버튼 표시 */
  @property({ type: Boolean, reflect: true }) removable = false;
  /** 파일 이름 */
  @property({ type: String }) name?: string;
  /** MIME 타입 */
  @property({ type: String }) type?: string;
  /** 파일 크기 (bytes) */
  @property({ type: Number }) size?: number;
  /** 미리보기용 파일 URL */
  @property({ type: String }) url?: string;

  /** 미리보기 오버레이가 열려있는지 여부 */
  @state() private previewOpen = false;

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    super.disconnectedCallback();
  }

  private get isImage(): boolean {
    return !!this.url && !!this.type?.startsWith("image/");
  }

  private get isVideo(): boolean {
    return !!this.url && !!this.type?.startsWith("video/");
  }

  /** 클릭 시 오버레이로 미리볼 수 있는 타입인지 여부 */
  private get previewable(): boolean {
    return this.isImage || this.isVideo;
  }

  render() {
    return html`
      <div class="card" @click=${this.handleCardClick}>
        <div class="thumbnail">
          ${this.isImage
            ? html`<img src=${this.url!} alt=${this.name || ''} loading="lazy" />`
            : this.isVideo
            ? html`<video src="${this.url}#t=0.1" preload="metadata" muted playsinline></video>`
            : html`<u-icon lib="internal-chat" name=${this.resolveIcon(this.type)}></u-icon>`}
        </div>

        <div class="info">
          <div class="name">${this.name}</div>
          <div class="meta">
            <span class="type">
              ${this.resolveExt(this.name, this.type)}
            </span>
            <span class="size">
              ${this.formatSize(this.size || 0)}
            </span>
          </div>
        </div>

        <u-button class="remove-btn"
          ?hidden=${!this.removable}
          title=${messages.text('remove')}
          aria-label=${messages.text('remove')}
          @click=${this.handleRemoveClick}>
          <u-icon lib="internal" name="x"></u-icon>
        </u-button>
      </div>

      ${this.previewOpen && this.previewable ? html`
        <div class="preview-overlay" @click=${this.closePreview}>
          <header class="preview-header">
            <span class="preview-name">${this.name}</span>
            <button class="preview-close" aria-label=${messages.text('closePreview')} @click=${this.closePreview}>
              <u-icon lib="internal" name="x"></u-icon>
            </button>
          </header>
          <div class="preview-body" @click=${(e: Event) => e.stopPropagation()}>
            ${this.isImage
              ? html`<img src=${this.url!} alt=${this.name || ''} />`
              : html`<video src=${this.url!} controls autoplay></video>`}
          </div>
        </div>
      ` : nothing}
    `;
  }

  private handleCardClick = () => {
    if (!this.previewable || this.previewOpen) return;
    this.previewOpen = true;
  }

  private closePreview = (e?: Event) => {
    e?.stopPropagation();
    this.previewOpen = false;
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.previewOpen && e.key === 'Escape') this.closePreview();
  };

  private handleRemoveClick = (e: Event) => {
    e.stopPropagation();
    if(this.fire<RemoveEventDetail>("remove")) {
      // 이벤트가 취소되지 않은 경우, 기본 동작으로 요소를 제거합니다.
      this.remove();
    }
  }

  /** MIME 타입 → Tabler Icon 이름 */
  private resolveIcon(mimeType?: string): string {
    if (!mimeType) return "file";
    if (mimeType.startsWith("image/"))    return "photo";
    if (mimeType.startsWith("video/"))    return "video";
    if (mimeType.startsWith("audio/"))    return "file-music";
    if (mimeType === "application/pdf")   return "file-type-pdf";

    const codeTypes = [
      "application/json", "application/javascript", "application/typescript",
      "application/xml", "text/html", "text/css", "text/javascript",
      "text/x-python", "text/x-java-source",
    ];
    if (codeTypes.includes(mimeType) || mimeType.startsWith("text/x-"))
      return "file-code";

    if (["application/vnd.ms-excel",
         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
         "text/csv"].includes(mimeType))
      return "file-spreadsheet";

    if (["application/zip", "application/x-zip-compressed",
         "application/x-tar", "application/x-rar-compressed",
         "application/gzip", "application/x-7z-compressed"].includes(mimeType))
      return "file-zip";

    if (mimeType.startsWith("text/")) return "file-text";

    return "file";
  }

  /** 파일명 또는 MIME 타입에서 확장자를 추출합니다. */
  private resolveExt(name?: string, mimeType?: string): string {
    if (name) {
      const dot = name.lastIndexOf(".");
      if (dot !== -1 && dot < name.length - 1)
        return name.slice(dot + 1).toLowerCase();
    }
    const map: Record<string, string> = {
      "image/jpeg": "jpg", "image/png": "png", "image/gif": "gif",
      "image/webp": "webp", "image/svg+xml": "svg",
      "application/pdf": "pdf", "text/plain": "txt",
      "text/csv": "csv", "application/json": "json", "application/zip": "zip",
    };
    return mimeType ? (map[mimeType] ?? mimeType.split("/").pop() ?? "") : "";
  }

  /** bytes → 읽기 좋은 크기 문자열 */
  private formatSize(bytes: number): string {
    if (bytes < 1024)
      return `${bytes} B`;
    if (bytes < 1024 ** 2)
      return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 ** 3)
      return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "u-file-block": UFileBlock;
  }
}