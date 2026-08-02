import { css } from "lit";

export const styles = css`
  :host {
    width: auto;
    max-width: 100%;
    display: flex;
    flex-direction: column;
  }
  :host([position="left"]) {
    align-self: flex-start;
    align-items: flex-start;
  }
  :host([position="right"]) {
    align-self: flex-end;
    align-items: flex-end;
  }

  .body {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .body[variant="default"] {
    padding: 12px;
    background-color: transparent;
  }
  .body[variant="bubble"] {
    padding: 12px 18px;
    border-radius: 18px;
    background-color: var(--u-neutral-200, #EEEEEE);
  }
  .body[variant="bubble"][position="left"] {
    border-bottom-left-radius: 4px;
  }
  .body[variant="bubble"][position="right"] {
    border-bottom-right-radius: 4px;
  }

  .dot-loader {
    width: 24px;
    height: 24px;
    fill: var(--u-txt-color, #212121);
  }
  .dot-loader circle {
    animation: bounce 1.05s infinite;
    transform-box: fill-box;
    transform-origin: center;
  }
  .dot-loader circle.d1 {
    animation-delay: 0.1s;
  }
  .dot-loader circle.d2 {
    animation-delay: 0.2s;
  }

  @media (prefers-reduced-motion: reduce) {
    .dot-loader circle {
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