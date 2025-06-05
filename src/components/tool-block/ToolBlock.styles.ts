import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    width: 100%;
    height: auto;
  }
  :host([collapsed]) .body {
    height: 0;
    padding: 0;
    overflow: hidden;
  }

  .container {
    display: block;
    border-radius: 8px;
    border: 1px solid var(--uc-border-color-mid);
    box-sizing: border-box;
  }

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .header .title {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
  }

  .body {
    height: auto;
    padding: 5px 10px;
    overflow-wrap: anywhere;
    box-sizing: border-box;
  }

  .footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding: 5px 10px;
    box-sizing: border-box;
  }

  .footer uc-button {
    font-size: 12px;
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--uc-border-color-mid);
    border-radius: 8px;
    box-sizing: border-box;
    color: var(--uc-text-color-high);
    font-size: 12px;
    line-height: 1.5;
  }

  .content .label {
    width: 100%;
    font-weight: 600;
    padding: 4px 8px;
    border-bottom: 1px solid var(--uc-border-color-mid);
    box-sizing: border-box;
    background-color: var(--uc-background-color-500);
  }

  .content .value {
    width: 100%;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    font-weight: 300;
    overflow: auto;
    max-height: 200px;
    padding: 8px;
    margin: 0;
    box-sizing: border-box;
    background-color: var(--uc-background-color-200);
  }

`;