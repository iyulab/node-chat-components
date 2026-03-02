import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import { UElement } from "@iyulab/components/dist/components/UElement.js";
import { UIcon } from "@iyulab/components/dist/components/icon/UIcon.component.js";
import { UButton } from "@iyulab/components/dist/components/button/UButton.component.js";
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
  };

  /** 파일 목록 */
  @property({ type: Array }) files: FileItem[] = [];
  /** 삭제 버튼 표시 여부 */
  @property({ type: Boolean, reflect: true }) removable = false;

  render() {
    if (!this.files?.length) return nothing;

    return repeat(this.files, (_, i) => i, (f, i) => html`
        <div class="item">
          <div class="icon-wrap">
            <u-icon lib="bootstrap" name=${this.resolveIcon(f.mimeType)}></u-icon>
            ${f.url ? html`
              <u-button class="download-btn" variant="borderless" title="다운로드"
                @click=${(e: Event) => this.handleDownloadClick(e, f)}>
                <u-icon lib="bootstrap" name="download"></u-icon>
              </u-button>
            ` : nothing}
          </div>
          <div class="info">
            <div class="name" title=${f.name}>${f.name}</div>
            <div class="meta">
              ${f.mimeType ? html`<span class="type-badge">${this.resolveExt(f.name, f.mimeType)}</span>` : nothing}
              ${f.size != null ? html`<span class="size">${this.formatSize(f.size)}</span>` : nothing}
            </div>
          </div>
          ${this.removable ? html`
            <u-button class="remove-btn" variant="borderless" title="삭제"
              @click=${(e: Event) => this.handleRemoveClick(e, i, f)}>
              <u-icon lib="bootstrap" name="x-lg"></u-icon>
            </u-button>
          ` : nothing}
        </div>
      `
    );
  }

  private handleDownloadClick = (e: Event, file: FileItem) => {
    e.stopPropagation();
    if (!file.url) return;
    const a = document.createElement("a");
    a.href = file.url;
    a.download = file.name;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private handleRemoveClick = (e: Event, index: number, file: FileItem) => {
    e.stopPropagation();
    this.emit("remove-file", { index, file });
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
    if (bytes < 1024)             return `${bytes} B`;
    if (bytes < 1024 ** 2)       return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 ** 3)       return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  }
}
