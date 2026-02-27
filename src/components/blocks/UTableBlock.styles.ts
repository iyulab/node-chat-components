import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    width: 100%;
    margin: 8px 0;
    border: 1px solid var(--u-border-color);
    border-radius: 8px;
    overflow: hidden;
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 6px 12px;
    background-color: var(--u-neutral-100);
    border-bottom: 1px solid var(--u-border-color);
    gap: 8px;
  }

  .toolbar button {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    font-size: 12px;
    color: var(--u-text-secondary, #666);
    background: transparent;
    border: 1px solid var(--u-border-color);
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.15s;
  }

  .toolbar button:hover {
    background-color: var(--u-neutral-200);
  }

  .table-wrapper {
    overflow-x: auto;
    width: 100%;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
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
    color: var(--u-text-primary);
  }

  th:hover {
    background-color: var(--u-neutral-200);
  }

  th .sort-icon {
    display: inline-block;
    margin-left: 4px;
    opacity: 0.4;
    font-size: 10px;
  }

  th.sorted-asc .sort-icon::after {
    content: "▲";
    opacity: 1;
  }

  th.sorted-desc .sort-icon::after {
    content: "▼";
    opacity: 1;
  }

  th:not(.sorted-asc):not(.sorted-desc) .sort-icon::after {
    content: "⇅";
  }

  td {
    padding: 8px 12px;
    border-bottom: 1px solid var(--u-border-color);
    color: var(--u-text-primary);
    vertical-align: top;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover td {
    background-color: var(--u-neutral-50, rgba(0,0,0,0.02));
  }

  .align-left   { text-align: left; }
  .align-center { text-align: center; }
  .align-right  { text-align: right; }

  .row-count {
    font-size: 12px;
    color: var(--u-text-secondary, #888);
  }
`;
