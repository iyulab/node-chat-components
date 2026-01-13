import { css } from "lit";

export const styles = css`
  svg {
    width: 1em;
    height: 1em;
    fill: currentColor;
    display: inline-block;
    vertical-align: middle;
  }

  circle {
    animation: bounce 1.05s infinite;
    transform-box: fill-box;
    transform-origin: center;
  }

  circle.d1 {
    animation-delay: 0.1s;
  }

  circle.d2 {
    animation-delay: 0.2s;
  }

  @media (prefers-reduced-motion: reduce) {
    circle {
      animation: none;
      transform: none;
    }
  }

  @keyframes bounce {
    0%,57.14% {
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
      transform: translateY(0);
    }

    28.57% {
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
      transform: translateY(-6px);
    }

    100% {
      transform: translateY(0);
    }
  }
`;
