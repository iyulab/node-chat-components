import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import "@iyulab/components/dist/components/icon/UIcon.js";
import "@iyulab/components/dist/components/button/UButton.js";
import "@iyulab/components/dist/components/skeleton/USkeleton.js";
import { UInput } from "@iyulab/components/dist/components/input/UInput.js";
import { UDataElement } from "../UDataElement.js";
import "../../utilities/icons.js";
import { styles } from "./UTableBlock.styles.js";

/** 테이블 셀 데이터 타입 */
export interface TableCell {
  /** 셀에 표시할 텍스트 내용 */
  text: string;
  /** 셀 내용의 정렬 방식. 기본값은 "left" */
  align: "left" | "center" | "right" | null;
}

/** 테이블 정렬 상태 */
export interface SortState {
  /** 현재 정렬 기준이 되는 컬럼 인덱스. -1이면 정렬 안 된 상태 */
  index: number;
  /** 정렬 방향. "asc"는 오름차순, "desc"는 내림차순 */
  dir: "asc" | "desc";
}

/**
 * 마크다운 테이블 데이터를 렌더링하는 컴포넌트입니다.
 * 컬럼 정렬, CSV 다운로드 기능을 지원합니다.
 * light DOM 내 `<script type="application/json">` 에서 데이터를 자동으로 읽어냅니다.
 */
@customElement("u-table-block")
export class UTableBlock extends UDataElement {
  static styles = [super.styles, styles];

  /** 테이블 헤더 목록. 각 헤더는 { text, align } 형식입니다. */
  @property({ type: Array }) headers: TableCell[] = [];
  /** 테이블 행 목록. 각 행은 셀 배열입니다. */
  @property({ type: Array }) rows: TableCell[][] = [];

  @state() private loading: boolean = false;
  @state() private sort: SortState = { index: -1, dir: "asc" };
  @state() private search: string = "";
  
  private searchCache?: string;
  private searchTimer: number | null = null;

  render() {
    const rows = this.getFilteredSortedRows();

    return html`
      <div class="toolbar">
        <div class="toolbar-left">
          <u-input
            class="toolbar-search"
            type="search"
            placeholder="Search..."
            .value=${this.search}
            @input=${this.handleSearchInput}
          >
            <u-icon slot="prefix" lib="internal" name="search"></u-icon>
          </u-input>
          <span class="toolbar-count">
            ${rows.length} / ${this.rows.length} Rows
          </span>
        </div>
        <div class="toolbar-right">
          <u-button @click=${this.handleDownloadXLS} title="Excel Download">
            XLS
            <u-icon slot="suffix" lib="internal-chat" name="download"></u-icon>
          </u-button>
          <u-button @click=${this.handleDownloadCSV} title="CSV Download">
            CSV
            <u-icon slot="suffix" lib="internal-chat" name="download"></u-icon>
          </u-button>
        </div>
      </div>
      <div class="table-wrapper" scrollable>
        <table>
          <thead ?hidden=${!this.headers.length}>
            <tr>
              ${repeat(this.headers, (_, i) => i, (h, i) => {
                const isActive = this.sort.index === i;
                return html`
                  <th
                    ?active=${isActive}
                    align=${h.align ?? "left"}
                    @click=${() => this.handleSortColumn(i)}
                  >
                    ${unsafeHTML(h.text)}
                    <u-icon
                      class="sort-icon"
                      lib="internal-chat"
                      name=${isActive ? (this.sort.dir === "asc" ? "sort-ascending-letters" : "sort-descending-letters") : "arrows-sort"}
                    ></u-icon>
                  </th>
                `;
              })}
            </tr>
          </thead>
          <tbody>
            ${this.loading 
              ? html`
                <tr>
                  <td colspan=${this.headers.length || 1}>
                    <u-skeleton lines="4" height="1.2em"></u-skeleton>
                  </td>
                </tr>
              `
              : repeat(rows, (_, i) => i, row => html`
                <tr>
                  ${repeat(row, (_, j) => j, cell => html`
                    <td align=${cell.align ?? "left"}>
                      ${unsafeHTML(this.renderHighlightedText(cell.text))}
                    </td>
                  `)}
                </tr>
            `)}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * 하이라이트 렌더링: search 기준으로 매칭되는 부분을 <mark>로 감쌉니다.
   * 내부적으로 안전하게 escape한 뒤 매칭을 위해 RegExp를 사용합니다.
   */
  private renderHighlightedText(text: string) {
    const q = this.search.trim();
    if (!q) return text;

    // 대소문자 무시 하이라이트
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(${escaped})`, "gi");

    // split에 캡처 그룹을 쓰면 매칭 문자열도 배열에 포함됩니다.
    const parts = String(text).split(re);
    if (parts.length === 1) return text;

    return parts.map((p, idx) =>
      idx % 2 === 1 ? `<mark>${p}</mark>` : p
    ).join("");
  }

  /**
   * 현재 검색어와 정렬 상태에 따라 필터링 및 정렬된 행 목록을 반환합니다.
   */
  private getFilteredSortedRows(): TableCell[][] {
    let rows = this.rows;

    // 검색어가 있으면 필터링 적용
    const q = this.search.trim();
    if (q) {
      const qLower = q.toLowerCase();
      rows = rows.filter(row => row.some(cell => cell.text.toLowerCase().includes(qLower)));
    }

    // 정렬 적용, 숫자면 숫자 비교, 아니면 문자 비교
    const { index, dir } = this.sort;
    if (index < 0) return rows;

    return [...rows].sort((a, b) => {
      const av = a[index]?.text ?? "";
      const bv = b[index]?.text ?? ""; 
      const an = Number(av);
      const bn = Number(bv);
      const cmp = (!isNaN(an) && !isNaN(bn))
        ? an - bn
        : av.localeCompare(bv, undefined, { sensitivity: "base" });
      return dir === "asc" ? cmp : -cmp;
    });
  }

  /* 250ms 디바운스되어 검색어가 업데이트되는 핸들러. */
  private handleSearchInput(e: Event) {
    const input = e.target as UInput;
    this.searchCache = input.value || "";

    if (this.searchTimer !== null) window.clearTimeout(this.searchTimer);
    this.loading = true;

    this.searchTimer = window.setTimeout(() => {
      this.search = this.searchCache || "";
      this.loading = false;
      this.searchTimer = null;
    }, 250);
  }

  /* 컬럼 헤더 클릭 시 정렬 상태를 토글하는 핸들러 */
  private handleSortColumn(index: number) {
    if (this.sort.index === index) {
      this.sort = { ...this.sort, dir: this.sort.dir === "asc" ? "desc" : "asc" };
    } else {
      this.sort = { index, dir: "asc" };
    }
  }

  /* CSV 다운로드 핸들러 */
  private handleDownloadCSV() {
    // CSV에서 쉼표, 큰따옴표, 줄바꿈이 포함된 값을 올바르게 처리하기 위한 이스케이프 함수
    const escCsv = (v: string) => (v.includes(",") || v.includes('"') || v.includes("\n"))
      ? `"${v.replace(/"/g, '""')}"`
      : v;
    const lines = [
      this.headers.map(h => escCsv(h.text)).join(","),
      ...this.rows.map(row => row.map(cell => escCsv(cell.text)).join(","))
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    this.triggerDownload(`table-${Date.now()}.csv`, blob);
  }

  /* XLS 다운로드 핸들러 */
  private handleDownloadXLS() {
    // XML에서 &, <, > 문자를 올바르게 처리하기 위한 이스케이프 함수
    const escXml = (v: string) => v
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const cell = (v: string) => `<Cell><Data ss:Type="String">${escXml(v)}</Data></Cell>`;
    const row = (cells: string[]) => `<Row>${cells.map(cell).join("")}</Row>`;

    const xml = [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<?mso-application progid="Excel.Sheet"?>`,
      `<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"`,
      ` xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">`,
      `<Worksheet ss:Name="Sheet1"><Table>`,
      row(this.headers.map(h => h.text)),
      ...this.rows.map(r => row(r.map(c => c.text))),
      `</Table></Worksheet></Workbook>`
    ].join("\n");

    const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8;" });
    this.triggerDownload(`table-${Date.now()}.xls`, blob);
  }

  /* 파일 다운로드 트리거 */
  private triggerDownload(filename: string, blob: Blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "u-table-block": UTableBlock;
  }
}