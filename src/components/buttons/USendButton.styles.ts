import { css } from "lit";

export const styles = css`
  :host {
    display: inline-flex;
    padding: 8px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    border: 1px solid var(--u-border-color, #d1d5db);
    background-color: var(--u-neutral-200, #e5e7eb);
    cursor: pointer;
  }
  :host(:hover) {
    background-color: var(--u-neutral-300, #d1d5db);
  }
  :host([disabled]) {
    pointer-events: none;
    opacity: 0.5;
  }
`;
