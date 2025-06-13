import { css } from "lit";

export const styles = css`
  :host {
    display: inline-flex;
    font-size: 32px;
    color: inherit;
  }

  svg {
    width: 1em;
    height: 1em;
    fill: currentColor;
    animation: rotate_action 0.7s infinite linear;
  }

  @keyframes rotate_action {
    100% {
      transform: rotate(360deg);
    }
  }
`;
