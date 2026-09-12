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

  .toolbar {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 12px;
    background-color: var(--u-neutral-100);
    border-bottom: 1px solid var(--u-border-color);
    gap: 8px;
  }

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  .toolbar-search {
    flex: 1;
    max-width: 200px;
    font-size: 12px;
  }

  .toolbar-count {
    font-size: 12px;
    color: var(--u-txt-color-weak);
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .toolbar-right u-button {
    font-size: 12px;
    padding: 0.25em 0.5em;
  }

  .table-wrapper {
    flex: 1 1 auto;
    min-height: 0;
    overflow-x: auto;
    overflow-y: auto;
    /* 제약이 없을 때의 기본 상한 — 채팅 스트림에서 긴 표가 화면을 삼키지 않게 한다.
       «최대» 이므로 위 flex 수축을 막지 않는다(호스트 제약이 이긴다). */
    max-height: 480px;
    width: 100%;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  thead {
    position: sticky;
    top: 0;
  }

  thead tr {
    background-color: var(--u-neutral-100);
  }

  th {
    padding: 8px 12px;
    font-weight: 600;
    text-align: left;
    border-bottom: 2px solid var(--u-border-color);
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
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
    font-size: 12px;
    opacity: 0.3;
    transition: opacity 0.15s;
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
