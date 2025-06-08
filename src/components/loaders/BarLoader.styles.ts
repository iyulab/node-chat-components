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

  .bar {
    animation: bounce_action 0.9s linear infinite;
    animation-delay: -0.9s;
  }
  .d1 {
    animation-delay: -0.8s;
  }
  .d2 {
    animation-delay: -0.7s;
  }
  .d3 {
    animation-delay: -0.6s;
  }
  .d4 {
    animation-delay: -0.5s;
  }

  @keyframes bounce_action {
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