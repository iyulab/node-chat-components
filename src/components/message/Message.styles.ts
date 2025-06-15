import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    line-height: 1.5;
  }

  .container {
    display: flex;
    flex-direction: column;
  }

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: 12px;
    border: none;
    border-radius: 8px;
    background-color: var(--uc-background-color-200);
  }

  .footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0px;
    gap: 12px;
    font-size: 12px;
  }
  .footer .flex {
    flex: 1;
  }
`;