import { css } from "lit";

export const styles = css`
  :host(:empty) u-tooltip {
    display: none;
  }
  :host([loading]) u-icon {
    animation: spin 1s linear infinite;
  }

  u-button {
    color: var(--u-txt-color-weak);
    font-size: 16px;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
