import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    width: 100%;
    height: auto;
    border: 1px solid var(--u-border-color);
    border-radius: 8px;
    font-size: 14px;
  }

  .container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .header {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px;
    cursor: pointer;
    user-select: none;
  }
  .header u-icon[name="eye"] {
    font-size: 16px;
    color: var(--u-blue-500);
  }
  .header u-icon[name="check-lg"] {
    color: var(--u-green-500);
  }
  .header u-icon[name="x-lg"] {
    color: var(--u-red-500);
  }
  .header .display {
    flex: 1;
    font-size: inherit;
    font-weight: 600;
    line-height: 1;
  }

  .body {
    display: block;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    width: 100%;
    max-height: 260px;
    overflow: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--u-scrollbar-color) transparent;
  }
  .body .viewer {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 8px;
    padding: 4px 8px;
  }
  .body .viewer:not(:last-child) {
    border-bottom: 1px dashed var(--u-border-color);
  }
  .body .viewer .label {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    font-weight: 400;
    width: 1.5em;
    height: 1.5em;
  }
  .body .viewer u-json-viewer {
    width: calc(100% - 1.5em);
    font-size: inherit;
    font-family: inherit;
    line-height: 1.5;
  }

  .footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding: 4px 12px;
  }
  .footer u-button {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    padding: 6px 8px;
    font-size: 12px;
  }
  .footer u-icon[name="check-lg"] {
    color: var(--u-green-500);
  }
  .footer u-icon[name="x-lg"] {
    color: var(--u-red-500);
  }
`;