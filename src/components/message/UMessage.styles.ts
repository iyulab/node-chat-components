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

  /* Variant styles */
  .variant-default .body {
    background-color: transparent;
    color: var(--u-txt-color, #333);
    padding: 8px 0;
  }

  .variant-bubble .body {
    background-color: var(--u-surface-color, #f5f5f5);
    color: var(--u-txt-color, #333);
    border-radius: 18px;
    padding: 14px 18px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    max-width: 70%;
  }

  /* Position styles for bubble variant */
  .variant-bubble.position-left {
    align-items: flex-start;
  }

  .variant-bubble.position-left .body {
    border-bottom-left-radius: 4px;
  }

  .variant-bubble.position-right {
    align-items: flex-end;
  }

  .variant-bubble.position-right .body {
    background-color: var(--u-primary-color, #007bff);
    color: white;
    border-bottom-right-radius: 4px;
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

  .actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .citations {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }

  .timestamp {
    white-space: nowrap;
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