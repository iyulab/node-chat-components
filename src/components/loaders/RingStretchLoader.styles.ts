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
    stroke: currentColor;
  }

  .ring {
    transform-origin: center;
    animation: rotate_action 2s linear infinite;
  }
  .ring circle {
    stroke-linecap: round;
    animation: stretch_action 1.5s ease-in-out infinite;
  }

  @keyframes rotate_action {
    100% {
      transform: rotate(360deg)
    }
  }
  @keyframes stretch_action {
    0% { 
      stroke-dasharray: 0 150;
      stroke-dashoffset: 0;
    }
    47.5% { 
      stroke-dasharray: 42 150;
      stroke-dashoffset: -16;
    }
    95%,100% { 
      stroke-dasharray: 42 150;
      stroke-dashoffset: -59;
    }
  }
`;