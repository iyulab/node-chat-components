import { css } from "lit";

export const styles = css`
  /* 세로 flex 인 이유: 소비자가 호스트에 높이·max-height 를 주면 그 제약이 .table-wrapper 까지
     닿아야 한다. 종전에는 display:block + 래퍼의 max-height:480px 리터럴이라, 호스트를 200px 로
     줄이면 래퍼가 480 을 유지해 330px 이 overflow:hidden 에 잘리고 스크롤바도 없었다. */
  :host {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 8px 0;
    border: 1px solid var(--u-border-color);
    border-radius: 8px;
    overflow: hidden;
  }

  /* 검색어 하이라이트(UTableBlock 의 공유 Highlight) — 종전 <mark> 와 같은 시스템 색. */
  ::highlight(u-table-block-search) {
    background-color: Mark;
    color: MarkText;
  }

  /* 글자 크기는 전부 em 이다 — 블록은 놓인 자리(채팅 패널 13px · 페이지 16px)의 글자 크기를 따른다.
     값은 16px 문맥에서 종전 리터럴과 같게 calc(<px>em / <부모 px>) 로 적는다.
     두 크기는 소비자가 바꿀 수 있다 — 셀은 --table-block-font-size, 툴바(검색 · 행 수 · 내려받기)는
     --table-block-meta-font-size. 비율이 상수면 최소 글자 크기를 둔 호스트가 툴바만 그 아래로 내려가는 것을
     막을 길이 없다(섀도 안이라 바깥 CSS 는 상속만 닿는다). 값의 em 은 쓰이는 자리에서 풀린다 — max(12px, 0.75em) 처럼. */
  /*
     툴바는 줄바꿈한다 — 폭이 모자라면 내려받기 묶음이 다음 줄로 가고, 종전처럼 행 수 표기 위에 겹쳐 그려지지 않는다. */
  .toolbar {
    flex: none;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding: 6px 12px;
    background-color: var(--u-neutral-100);
    border-bottom: 1px solid var(--u-border-color);
    gap: 4px 8px;
  }

  .toolbar-left {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 8px;
    flex: 1 1 12em;
    min-width: 0;
  }

  .toolbar-search {
    flex: 1 1 8em;
    min-width: 0;
    max-width: 200px;
    font-size: var(--table-block-meta-font-size, calc(12em / 16));
  }

  .toolbar-count {
    font-size: var(--table-block-meta-font-size, calc(12em / 16));
    white-space: nowrap;
    color: var(--u-txt-color-weak);
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: none;
    margin-inline-start: auto;
  }

  .toolbar-right u-button {
    font-size: var(--table-block-meta-font-size, calc(12em / 16));
    padding: 0.25em 0.5em;
  }

  .table-wrapper {
    flex: 1 1 auto;
    min-height: 0;
    overflow-x: auto;
    overflow-y: auto;
    /* 제약이 없을 때의 기본 상한 — 채팅 스트림에서 긴 표가 화면을 삼키지 않게 한다.
       «최대» 이므로 위 flex 수축을 막지 않는다(호스트 제약이 이긴다). 호스트 max-height 는 줄이기만 하므로
       상한을 늘리거나 끄는 자리는 커스텀 속성이다 — 이미 스크롤되는 기록 안에서는 none(중첩 스크롤 없음). */
    max-height: var(--table-block-max-height, 480px);
    width: 100%;
  }

  /* 열은 내용 폭을 갖고(넓은 호스트에서는 폭을 채운다) 표가 넘치면 래퍼가 가로로 스크롤한다.
     종전 width:100% 는 좁은 호스트에서 열을 짜내, 화면 밖 열의 긴 글이 그 좁은 폭 안에서 줄바꿈돼
     모든 행이 몇 줄 높이가 됐다. 칸 하나의 최대 폭은 --table-block-cell-max-width(기본 32em) —
     none 이면 줄바꿈 없이 한 줄이다. */
  table {
    width: max-content;
    min-width: 100%;
    border-collapse: collapse;
    font-size: var(--table-block-font-size, calc(14em / 16));
  }

  .cell {
    max-inline-size: var(--table-block-cell-max-width, 32em);
  }

  thead {
    position: sticky;
    top: 0;
  }

  thead tr {
    background-color: var(--u-neutral-100);
  }

  th {
    padding: 0;
    font-weight: 600;
    text-align: left;
    border-bottom: 2px solid var(--u-border-color);
    white-space: nowrap;
    user-select: none;
  }

  /* 칸 전체가 누를 면이다 — 여백을 th 가 아니라 버튼이 갖는다. */
  .sort-button {
    all: unset;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    inline-size: 100%;
    padding: 8px 12px;
    min-block-size: var(--u-target-size, 0px);
    font: inherit;
    color: inherit;
    cursor: pointer;
  }
  th[align="center"] .sort-button { justify-content: center; }
  th[align="right"] .sort-button { justify-content: flex-end; }
  .sort-button:focus-visible {
    outline: 2px solid var(--u-primary-color, #1976D2);
    outline-offset: -2px;
  }
  th:hover {
    background-color: var(--u-neutral-200);
  }
  th:hover .sort-icon {
    opacity: 0.7;
  }
  th[active] {
    color: var(--u-primary-color, #1976D2);
  }
  th[active] .sort-icon {
    opacity: 1;
  }

  th .sort-icon {
    display: inline-flex;
    margin-left: 4px;
    font-size: calc(12em / 14);
    opacity: 0.3;
    transition: opacity var(--u-duration-fast, 140ms);
  }

  tbody tr {
    background-color: var(--u-neutral-0);
  }
  tbody tr:hover td {
    background-color: var(--u-neutral-50, #FAFAFA);
  }
  tbody tr:last-child td {
    border-bottom: none;
  }

  td {
    padding: 8px 12px;
    border-bottom: 1px solid var(--u-border-color);
    vertical-align: top;
  }

  th[align="left"], td[align="left"] {
    text-align: left; 
  }
  th[align="center"], td[align="center"] { 
    text-align: center; 
  }
  th[align="right"], td[align="right"] { 
    text-align: right; 
  }
`;
