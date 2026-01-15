import { css } from "lit";

export const styles = css`
  :host(:empty) u-tooltip {
    display: none;
  }

  u-button {
    color: var(--u-txt-color-weak);
    font-size: 16px;
  }

  u-icon[name="check-lg"] {
    color: var(--u-green-500);
  }
`;