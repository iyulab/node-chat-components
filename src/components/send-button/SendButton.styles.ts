import { css } from "lit";

export const styles = css`
  :host {
    display: inline-flex;
    padding: 8px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    color: #fff;
    background-color: var(--uc-background-color-1000);
    cursor: pointer;
  }
  :host(:hover) {
    filter: brightness(1.2);
  }
  :host(:active) {
    filter: brightness(0.9);
  }
  :host([disabled]) {
    pointer-events: none;
    opacity: 0.5;
  }
`;
