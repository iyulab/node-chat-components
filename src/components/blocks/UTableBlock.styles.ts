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
    overflow-x: auto;
    overflow-y: auto;
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
    z-index: 10;
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
    color: var(--u-primary, #4a90e2);
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
    background-color: var(--u-neutral-50, rgba(0,0,0,0.02));
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
