import { css } from "lit";

export const styles = css`
  :host {
    position: relative;
    padding: 8px;
    font-size: 16px;
    border-radius: 8px;
    background-color: var(--uc-background-color-200);
    cursor: pointer;
    user-select: none;
  }
  :host(:hover) {
    background-color: var(--uc-background-color-300);
  }
  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed;
  }
  :host([mode="none"]) {
    background-color: transparent;
  }

  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  uc-icon {
    font-size: inherit;
    color: var(--uc-yellow-color-500);
  }
  uc-icon[status="none"] {
    color: currentColor;
  }

  .label {
    font-size: inherit;
  }
`;
