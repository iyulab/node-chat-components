import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import { UElement } from "@iyulab/components/dist/components/UElement.js";
import { UIcon } from "@iyulab/components/dist/components/icon/UIcon.component.js";
import { UButton } from "@iyulab/components/dist/components/button/UButton.component.js";
import { UProgressBar } from "@iyulab/components/dist/components/progress-bar/UProgressBar.component.js";
import type { FileItem } from "../../types/BlockItem.js";
import { styles } from "./UFilesBlock.styles.js";

/**
 * 여러 파일을 그리드 형태로 표시하는 블록 컴포넌트입니다.
 */
export class UFilesBlock extends UElement {
  static styles = [super.styles, styles];
  static dependencies: Record<string, typeof UElement> = {
    "u-icon": UIcon,
    "u-button": UButton,
    "u-progress-bar": UProgressBar,
  };

  /** 파일 목록 */
  @property({ type: Array }) files: FileItem[] = [];
  /** 삭제 버튼 표시 여부 */
  @property({ type: Boolean, reflect: true }) removable = false;

  render() {
    if (!this.files?.length) return nothing;

    return repeat(this.files, (_, i) => i, (f, i) => {
      const phase = f.upload?.phase ?? "done";
      const isUploading = phase === "uploading";
      const isError = phase === "error";

      return html`
        <div class="item" phase=${phase}>
          <div class="thumbnail">
            <u-icon lib="bootstrap" name=${this.resolveIcon(f.type)}></u-icon>
            <div class="thumbnail-overlay" ?hidden=${!isUploading}>
              <u-icon lib="bootstrap" name="cloud-arrow-up"></u-icon>
            </div>
            <div class="thumbnail-overlay" ?hidden=${!isError}>
              <u-icon lib="bootstrap" name="exclamation-circle-fill"></u-icon>
            </div>
            <u-button class="download-btn"
              ?hidden=${!f.downloadUrl || isUploading}
              data-index=${i}
              title="Download"
              variant="borderless"
              @click=${this.handleDownloadClick}>
              <u-icon lib="bootstrap" name="download"></u-icon>
            </u-button>
          </div>
          <div class="info">
            <div class="name" title=${f.name}>${f.name}</div>
            <div class="meta">
              <span class="type" ?hidden=${!f.type || isError}>
                ${this.resolveExt(f.name, f.type)}
              </span>
              <span class="size" ?hidden=${f.size == null || isError}>
                ${this.formatSize(f.size || 0)}
              </span>
              <span class="error-msg" ?hidden=${!isError}>
                <u-icon lib="bootstrap" name="exclamation-triangle"></u-icon>
                ${(f.upload as { phase: "error"; message?: string } | undefined)?.message ?? "File upload failed"}
              </span>
            </div>
          </div>
          <u-progress-bar class="upload-progress"
            ?hidden=${!isUploading}
            ?indeterminate=${(f.upload as { phase: "uploading"; progress?: number } | undefined)?.progress == null}
            value=${(f.upload as { phase: "uploading"; progress?: number } | undefined)?.progress ?? 0}
          ></u-progress-bar>
          <u-button class="remove-btn"
            ?hidden=${!this.removable}
            data-index=${i}
            title="Remove"
            variant="borderless"
            @click=${this.handleRemoveClick}>
            <u-icon lib="bootstrap" name="x-lg"></u-icon>
          </u-button>
        </div>
      `;
    });
  }

  private handleDownloadClick = (e: Event) => {
    e.stopPropagation();
    const index = (e.currentTarget as HTMLElement).dataset.index;
    if (index == null) return;
    const file = this.files.at(Number(index));
    if (!file?.downloadUrl) return;
    const a = document.createElement("a");
    a.href = file.downloadUrl;
    a.download = file.name;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  private handleRemoveClick = (e: Event) => {
    e.stopPropagation();
    const index = (e.currentTarget as HTMLElement).dataset.index;
    if (index == null) return;
    const file = this.files.at(Number(index));
    if (!file) return;
    this.emit("u-remove", { index, file });
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
