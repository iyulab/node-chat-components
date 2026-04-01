import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@iyulab/components/dist/components/icon/UIcon.js";
import "@iyulab/components/dist/components/button/UButton.js";
import "@iyulab/components/dist/components/spinner/USpinner.js";
import { RemoveEventDetail } from "@iyulab/components/dist/events/RemoveEvent.js";
import { UElement } from "@iyulab/components/dist/components/UElement.js";
import { styles } from "./UFileBlock.styles.js";

/**
 * 단일 파일을 표시하는 블록 컴포넌트입니다.
 */
@customElement("u-file-block")
export class UFileBlock extends UElement {
  static styles = [super.styles, styles];

  /** 삭제 버튼 표시 */
  @property({ type: Boolean, reflect: true }) removable = false;
  /** 파일 상태 */
  @property({ type: String, reflect: true }) status?: | 'idle' | 'uploading' | 'error';
  /** 파일 이름 */
  @property({ type: String }) name?: string;
  /** MIME 타입 */
  @property({ type: String }) type?: string;
  /** 파일 크기 (bytes) */
  @property({ type: Number }) size?: number;
  /** 다운로드 URL */
  @property({ type: String }) url?: string;

  render() {
    return html`
      <div class="thumbnail">
        <u-spinner 
          ?hidden=${this.status !== 'uploading'}
        ></u-spinner>  
        <u-icon
          ?hidden=${this.status !== 'error'}
          lib="bootstrap" 
          name="file-earmark-x"
        ></u-icon>
        <u-icon
          ?hidden=${this.status && this.status !== 'idle'}
          lib="bootstrap" 
          name=${this.resolveIcon(this.type)}
        ></u-icon>
        <u-button class="download-btn"
          ?hidden=${!this.url || this.status === 'uploading' || this.status === 'error'}
          title="Download"
          @click=${this.handleDownloadClick}>
          <u-icon lib="bootstrap" name="download"></u-icon>
        </u-button>
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
        title="Remove"
        @click=${this.handleRemoveClick}>
        <u-icon lib="internal" name="x-lg"></u-icon>
      </u-button>
    `;
  }

  private handleDownloadClick = (e: Event) => {
    e.stopPropagation();
    if (!this.url) return;
    const a = document.createElement("a");
    a.href = this.url;
    a.download = this.name || "unknown-file";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  private handleRemoveClick = (e: Event) => {
    e.stopPropagation();
    if(this.fire<RemoveEventDetail>("remove")) {
      // 이벤트가 취소되지 않은 경우, 기본 동작으로 요소를 제거합니다.
      this.remove();
    }
  }

  /** MIME 타입 → Bootstrap Icon 이름 */
  private resolveIcon(mimeType?: string): string {
    if (!mimeType) return "file-earmark";
    if (mimeType.startsWith("image/"))    return "file-earmark-image";
    if (mimeType.startsWith("video/"))    return "file-earmark-play";
    if (mimeType.startsWith("audio/"))    return "file-earmark-music";
    if (mimeType === "application/pdf")   return "file-earmark-pdf";

    const codeTypes = [
      "application/json", "application/javascript", "application/typescript",
      "application/xml", "text/html", "text/css", "text/javascript",
      "text/x-python", "text/x-java-source",
    ];
    if (codeTypes.includes(mimeType) || mimeType.startsWith("text/x-"))
      return "file-earmark-code";

    if (["application/vnd.ms-excel",
         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
         "text/csv"].includes(mimeType))
      return "file-earmark-spreadsheet";

    if (["application/zip", "application/x-zip-compressed",
         "application/x-tar", "application/x-rar-compressed",
         "application/gzip", "application/x-7z-compressed"].includes(mimeType))
      return "file-earmark-zip";

    if (mimeType.startsWith("text/")) return "file-earmark-text";

    return "file-earmark";
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