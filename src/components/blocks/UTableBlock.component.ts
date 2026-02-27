import { html, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import { BaseElement } from "@iyulab/components/dist/components/BaseElement.js";
import { styles } from "./UTableBlock.styles.js";

/**
 * 마크다운 테이블 데이터를 렌더링하는 컴포넌트입니다.
 * 컬럼 정렬, CSV 다운로드 기능을 지원합니다.
 */
export class UTableBlock extends BaseElement {
  static styles = [super.styles, styles];

  /** 테이블 헤더 목록. 각 헤더는 { text, align } 형식입니다. */
  @property({ type: Array }) headers: TableHeader[] = [];
  /** 테이블 행 목록. 각 행은 셀 텍스트 배열입니다. */
  @property({ type: Array }) rows: string[][] = [];

  @state() private sortColIndex: number = -1;
  @state() private sortDir: "asc" | "desc" = "asc";

  connectedCallback() {
    super.connectedCallback();
    this._readScriptData();
  }

  /** light DOM 내 <script type="application/json"> 에서 데이터를 읽어냅니다. */
  private _readScriptData() {
    const script = this.querySelector('script[type="application/json"]');
    if (!script) return;
    try {
      const data: TableData = JSON.parse(script.textContent ?? "{}");
      this.headers = data.headers ?? [];
      this.rows = data.rows ?? [];
    } catch {
      // 파싱 실패 시 빈 상태 유지
    }
  }

  private get _sortedRows(): string[][] {
    if (this.sortColIndex < 0) return this.rows;

    return [...this.rows].sort((a, b) => {
      const av = a[this.sortColIndex] ?? "";
      const bv = b[this.sortColIndex] ?? "";
      // 숫자면 숫자 비교, 아니면 문자 비교
      const an = Number(av), bn = Number(bv);
      const cmp = (!isNaN(an) && !isNaN(bn))
        ? an - bn
        : av.localeCompare(bv, undefined, { sensitivity: "base" });
      return this.sortDir === "asc" ? cmp : -cmp;
    });
  }

  private _onSortClick(colIndex: number) {
    if (this.sortColIndex === colIndex) {
      this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
    } else {
      this.sortColIndex = colIndex;
      this.sortDir = "asc";
    }
  }

  private _downloadCSV() {
    const escape = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
    const lines = [
      this.headers.map(h => escape(h.text)).join(","),
      ...this.rows.map(row => row.map(escape).join(","))
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "table.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  render() {
    if (!this.headers.length) return nothing;

    const sorted = this._sortedRows;

    return html`
      <div class="toolbar">
        <span class="row-count">${this.rows.length}개 행</span>
        <button @click=${this._downloadCSV} title="CSV 다운로드">
          ↓ CSV
        </button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              ${this.headers.map((h, i) => {
                const sortClass =
                  this.sortColIndex === i
                    ? (this.sortDir === "asc" ? "sorted-asc" : "sorted-desc")
                    : "";
                const alignClass = h.align ? `align-${h.align}` : "align-left";
                return html`
                  <th
                    class="${sortClass} ${alignClass}"
                    @click=${() => this._onSortClick(i)}
                  >
                    ${h.text}<span class="sort-icon"></span>
                  </th>
                `;
              })}
            </tr>
          </thead>
          <tbody>
            ${sorted.map(row => html`
              <tr>
                ${row.map((cell, i) => {
                  const align = this.headers[i]?.align;
                  const alignClass = align ? `align-${align}` : "align-left";
                  return html`<td class="${alignClass}">${cell}</td>`;
                })}
              </tr>
            `)}
          </tbody>
        </table>
      </div>
      <slot hidden></slot>
    `;
  }
}

// 내부 타입 정의
interface TableHeader {
  text: string;
  align: "left" | "center" | "right" | null;
}

interface TableData {
  headers: TableHeader[];
  rows: string[][];
}
