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
    background-color: var(--u-neutral-100, #f3f4f6);
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
  
  u-icon {
    font-size: inherit;
  }
  u-icon[name="copy"] {
    color: inherit;
  }
  u-icon[name="check"] {
    color: var(--u-green-500);
  }

  .display {
    font-size: inherit;
    color: inherit;
    line-height: 1;
  }
`;
