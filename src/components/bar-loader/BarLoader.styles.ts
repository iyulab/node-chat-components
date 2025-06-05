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
  }

  .bounce-bar {
    animation: bounce 0.9s linear infinite;
    animation-delay: -0.9s;
  }
  .delay-1 {
    animation-delay: -0.8s;
  }
  .delay-2 {
    animation-delay: -0.7s;
  }
  .delay-3 {
    animation-delay: -0.6s;
  }
  .delay-4 {
    animation-delay: -0.5s;
  }

  @keyframes bounce {
    0%, 66.66% {
      animation-timing-function: cubic-bezier(0.36, 0.61, 0.3, 0.98);
      y: 6px;
      height: 12px;
    }
    33.33% {
      animation-timing-function: cubic-bezier(0.36, 0.61, 0.3, 0.98);
      y: 1px;
      height: 22px;
    }
  }
`;