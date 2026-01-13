import { css } from "lit";

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    font-size: 14px;
    padding: 8px;
    border: 1px solid var(--u-border-color);
    border-radius: 8px;
  }

  .header {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    cursor: pointer;
    user-select: none;
  }
  .header u-icon[name="tools"] {
    color: var(--u-blue-800);
  }
  .header .title {
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
    margin-top: 8px;
  }
  .body u-json-viewer {
    font-size: inherit;
    font-family: inherit;
    line-height: 1.5;
  }
  .body u-icon[name="chevron-down"] {
    align-self: center;
    font-size: 16px;
    color: var(--u-neutral-600, #4b5563);
  }
  .body .output-view {
    display: flex;
    flex-direction: column;
  }
`;