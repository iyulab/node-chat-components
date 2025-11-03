import { css } from "lit";

export const styles = css`
  :host {
    position: relative;
    display: inline-flex;
    padding: 8px;
    font-size: 16px;
    border-radius: 8px;
    cursor: pointer;
  }
  :host(:hover) {
    background-color: var(--uc-background-color-200);
  }

  uc-icon {
    font-size: inherit;
    opacity: 0.8;
  }

  input[type="file"] {
    display: none;
  }
`;