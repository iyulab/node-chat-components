import { css } from "lit";

export const styles = css`
  :host {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  :host(:empty) u-tooltip {
    display: none;
  }

  u-button {
    color: var(--u-txt-color-weak);
    font-size: 16px;
  }
`;
