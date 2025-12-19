import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    line-height: 1.5;
  }

  .container {
    display: flex;
    flex-direction: column;
  }

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 8px;
    border: none;
    border-radius: 8px;
  }

  .footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0px;
    gap: 12px;
    font-size: 12px;
  }

  .loader {
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