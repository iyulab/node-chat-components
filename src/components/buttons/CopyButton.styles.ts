import { css } from "lit";

export const styles = css`
  :host {
    position: relative;
    padding: 8px;
    border-radius: 8px;
    font-size: inherit;
    color: inherit;
    background-color: transparent;
    cursor: pointer;
  }
  :host(:hover) {
    background-color: var(--uc-background-color-200);
  }
  :host([isCopied]) {
    pointer-events: none;
    background-color: transparent;
  }
  :host([mode="symbol"]) {
    display: inline-flex;
  }
  :host([mode="badge"]) {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
  }
  
  uc-icon {
    font-size: inherit;
  }
  uc-icon[name="copy"] {
    color: inherit;
  }
  uc-icon[name="check"] {
    color: var(--uc-green-color-500);
  }

  .display {
    font-size: inherit;
    color: inherit;
    line-height: 1;
  }
`;
