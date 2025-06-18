import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    width: 100%;
    height: auto;
    border: 1px solid var(--uc-border-color-low);
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
  .header uc-hourglass-rotate-loader,
  .header uc-ring-stretch-loader {
    font-size: inherit;
    color: var(--uc-background-color-1000);
  }
  .header uc-icon[name="shield-lock"] {
    color: var(--uc-red-color-500);
  }
  .header uc-icon[name="shield-check"] {
    color: var(--uc-green-color-500);
  }
  .header uc-icon[name="check"] {
    color: var(--uc-green-color-500);
  }
  .header uc-icon[name="x-lg"] {
    color: var(--uc-red-color-500);
  }
  .header uc-icon[name="pause"] {
    font-size: 16px;
    color: var(--uc-blue-color-500);
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
    scrollbar-color: var(--uc-scrollbar-color) transparent;
  }
  .body .viewer {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 8px;
    padding: 4px 8px;
    background-color: var(--uc-background-color-100);
  }
  .body .viewer .label {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    font-size: inherit;
    font-weight: 400;
    line-height: 1.5;
    user-select: none;
    width: 1.5em;
    height: 1.5em;
  }
  .body .viewer .label uc-icon {
    font-size: 1em;
  }
  .body .viewer uc-json-viewer {
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
  .footer uc-button {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    padding: 6px 8px;
    font-size: 12px;
  }
  .footer uc-icon[name="check"] {
    color: var(--uc-green-color-500);
  }
  .footer uc-icon[name="x-lg"] {
    color: var(--uc-red-color-500);
  }
`;