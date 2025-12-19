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
    background-color: var(--u-neutral-100, #f3f4f6);
  }

  input[type="file"] {
    display: none;
  }
`;