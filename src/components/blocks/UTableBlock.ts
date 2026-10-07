import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import "@iyulab/components/dist/components/icon/UIcon.js";
import "@iyulab/components/dist/components/button/UButton.js";
import "@iyulab/components/dist/components/skeleton/USkeleton.js";
// 부수효과 import — 이 모듈이 그리는 `<u-input>` 을 등록한다(타입만 가져오면 빌드가 import 를 지워 등록되지 않는다).
import "@iyulab/components/dist/components/input/UInput.js";
import type { UInput } from "@iyulab/components/dist/components/input/UInput.js";
import { UDataElement } from "../UDataElement.js";
import "../../utilities/icons.js";
import { styles } from "./UTableBlock.styles.js";
import { messages } from "../../utilities/messages.js";

/**
 * 테이블 셀 데이터 타입.
 *
 * `text` 는 **글자**다 — 그대로 보이고, 검색·정렬·CSV/XLS 내려받기가 이것을 쓴다. 서식이 있는 셀(마크다운의
 * 굵게·코드·링크)은 `html` 에 마크업을 따로 싣는다 — 그러면 화면은 `html` 을, 검색·정렬·내려받기는 여전히 `text` 를 쓴다.
 * 종전에는 `text` 하나가 마크업이라 이름과 달리 글자를 HTML 로 그렸고(넣은 문자열에 따라 마크업 주입),
 * 검색·정렬·내려받기가 태그까지 읽었다.
 */
export interface TableCell {
  /** 셀의 글자 — 표시(`html` 이 없을 때) · 검색 · 정렬 · 내려받기 */
  text: string;
  /**
   * 셀을 서식과 함께 그릴 **신뢰된** HTML 마크업 — 화면에만 쓰인다. `UMarkedBlock` 이 자기 마크다운 렌더러
   * (원시 HTML 은 글자로, 위험한 링크 프로토콜 차단)의 출력으로 채운다. 외부 문자열을 그대로 넣지 말 것.
   */
  html?: string;
  /** 셀 내용의 정렬 방식. 기본값은 "left" */
  align: "left" | "center" | "right" | null;
}

/** 검색어 하이라이트의 등록 이름 — 스타일의 `::highlight(u-table-block-search)` 와 같다. */
const SEARCH_HIGHLIGHT = 'u-table-block-search';

/**
 * 모든 표가 나눠 쓰는 하이라이트 하나(등록은 문서 전역이다). 지원하지 않는 브라우저에서는 없다 — 그때는
 * 검색이 행을 거르기만 하고 글자를 칠하지 않는다.
 */
function searchHighlight(): Highlight | undefined {
  const registry = typeof CSS !== 'undefined' ? CSS.highlights : undefined;
  if (!registry || typeof Highlight === 'undefined') return undefined;
  let highlight = registry.get(SEARCH_HIGHLIGHT);
  if (!highlight) {
    highlight = new Highlight();
    registry.set(SEARCH_HIGHLIGHT, highlight);
  }
  return highlight;
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
  /** 이 표가 공유 하이라이트에 더한 범위 — 다시 그릴 때·떼어질 때 걷는다. */
  private searchRanges: Range[] = [];

  protected updated(): void {
    this.paintSearch();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.clearSearchRanges();
  }

  render() {
    const rows = this.getFilteredSortedRows();

    return html`
      <div class="toolbar">
        <div class="toolbar-left">
          <u-input
            class="toolbar-search"
            type="search"
            placeholder=${messages.text('search')}
            aria-label=${messages.text('searchLabel')}
            .value=${this.search}
            @input=${this.handleSearchInput}
          >
            <u-icon slot="prefix" lib="internal" name="search"></u-icon>
          </u-input>
          <span class="toolbar-count">
            ${messages.text('rowCount', { shown: rows.length, total: this.rows.length })}
          </span>
        </div>
        <div class="toolbar-right">
          <u-button @click=${this.handleDownloadXLS} title=${messages.text('excelDownload')}>
            XLS
            <u-icon slot="suffix" lib="internal-chat" name="download"></u-icon>
          </u-button>
          <u-button @click=${this.handleDownloadCSV} title=${messages.text('csvDownload')}>
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
                    aria-sort=${isActive ? (this.sort.dir === "asc" ? "ascending" : "descending") : "none"}
                  >
                    <!-- 정렬은 머리 칸 전체를 채우는 버튼이다 — 클릭만 받는 th 는 키보드로 닿지 않았다. -->
                    <button type="button" class="sort-button" part="sort-button"
                      @click=${() => this.handleSortColumn(i)}>
                      ${this.cellContent(h)}
                      <u-icon
                        class="sort-icon"
                        lib="internal-chat"
                        name=${isActive ? (this.sort.dir === "asc" ? "sort-ascending-letters" : "sort-descending-letters") : "arrows-sort"}
                      ></u-icon>
                    </button>
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
                      ${this.cellContent(cell)}
                    </td>
                  `)}
                </tr>
            `)}
          </tbody>
        </table>
      </div>
    `;
  }

  /** 셀 내용 — 서식 마크업(`html`)이 있으면 그것을, 없으면 글자(`text`)를 그린다. */
  private cellContent(cell: TableCell) {
    // html-sink: `TableCell.html` 은 신뢰된 마크업만 싣는 명시적 필드다(UMarkedBlock 의 렌더러 출력) — 글자는 `text` 로 그린다
    return cell.html != null ? unsafeHTML(cell.html) : cell.text;
  }

  /**
   * 검색어 하이라이트 — 본문 셀의 글자 노드에서 찾은 자리를 공유 하이라이트에 범위로 더한다(CSS Custom Highlight API).
   * DOM 을 바꾸지 않는다: 종전처럼 마크업 문자열에 `<mark>` 를 끼우면 태그·엔티티 안의 글자까지 잘렸다
   * (`&amp;` 에서 «amp» 를 찾으면 엔티티가 깨졌다).
   */
  private paintSearch() {
    this.clearSearchRanges();
    const highlight = searchHighlight();
    const q = this.search.trim().toLowerCase();
    const body = this.shadowRoot?.querySelector('tbody');
    if (!highlight || !q || !body) return;
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
      const text = node.data.toLowerCase();
      // 소문자화가 길이를 바꾸는 글자(드물다)가 있으면 위치가 어긋난다 — 그 노드는 칠하지 않는다.
      if (text.length !== node.data.length) continue;
      for (let at = text.indexOf(q); at >= 0; at = text.indexOf(q, at + q.length)) {
        const range = new Range();
        range.setStart(node, at);
        range.setEnd(node, at + q.length);
        highlight.add(range);
        this.searchRanges.push(range);
      }
    }
  }

  private clearSearchRanges() {
    const highlight = searchHighlight();
    if (highlight) for (const range of this.searchRanges) highlight.delete(range);
    this.searchRanges = [];
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