import { css } from "lit";

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
  }
  :host([variant="default"]) {
    width: 100%;
  }
  :host([variant="bubble"]) {
    width: auto;
    min-width: 40px;
    max-width: 80%;
  }
  :host([position="left"]) {
    align-self: flex-start;
    align-items: flex-start;
  }
  :host([position="right"]) {
    align-self: flex-end;
    align-items: flex-end;
  }

  .body {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .body[variant="default"] {
    padding: 12px;
    background-color: transparent;
  }
  .body[variant="bubble"] {
    padding: 12px 18px;
    border-radius: 18px;
    background-color: var(--u-neutral-200, #f3f4f6);
  }
  .body[variant="bubble"][position="left"] {
    border-bottom-left-radius: 4px;
  }
  .body[variant="bubble"][position="right"] {
    border-bottom-right-radius: 4px;
  }

  u-dot-loader {
    font-size: 24px;
    color: var(--u-neutral-800, #6b7280);
  }
`;