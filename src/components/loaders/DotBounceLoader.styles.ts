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

  .dot {
    animation: bounce_action 1.05s infinite
  }
  .d1 {
    animation-delay:.1s
  }
  .d2 {
    animation-delay:.2s
  }

  @keyframes bounce_action {
    0%,57.14% {
      animation-timing-function: cubic-bezier(0.33,.66,.66,1);
      transform: translate(0);
    }
    28.57% {
      animation-timing-function: cubic-bezier(0.33,0,.66,.33);
      transform: translateY(-6px);
    }
    100% {
      transform: translate(0);
    }
  }
`;