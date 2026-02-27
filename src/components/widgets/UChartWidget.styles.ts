import { css } from "lit";

export const styles = css`
  :host {
    margin: 0.75em auto;
    display: block;
    width: 100%;
    padding: 1em;
    background: var(--u-bg-color);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  canvas {
    width: 100% !important;
  }
`;
