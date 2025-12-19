import { css } from "lit";

export const styles = css`
  :host {
    --loading-rows: 3;
    --max-rows: 10;
  }

  :host {
    display: block;
    width: 100%;
    height: auto;
  }
  :host([loading]) .header {
    pointer-events: none;
    cursor: wait;
  }
  :host([loading]) .body {
    overflow: hidden !important;
    max-height: calc(1.5em * var(--loading-rows) + 8px);
    animation: pulse_action 1.5s infinite;
    pointer-events: none;
    cursor: wait;
  }

  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
    border: 1px solid var(--u-border-color);
    border-radius: 8px;
    font-size: 14px;
  }

  .header {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
    cursor: pointer;
    user-select: none;
  }
  .header .title {
    flex: 1;
    font-size: inherit;
    font-weight: 600;
    line-height: 1;
  }
  .header .title.dots::after {
    content: '';
    animation: dots_action 1.5s infinite;
  }

  .body {
    overflow: auto;
    padding: 8px;
    max-height: calc(1.5em * var(--max-rows) + 8px);
    font-size: inherit;
    line-height: 1.5;
    font-weight: 300;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    transition: max-height 0.15s ease, padding 0.15s ease;
  }
  .body[collapsed] {
    overflow: hidden !important;
    padding: 0;
    max-height: 0;
  }

  @keyframes dots_action {
    0%, 20% { content: ' '; }
    40% { content: ' .'; }
    60% { content: ' ..'; }
    80%, 100% { content: ' ...'; }
  }

  @keyframes pulse_action {
    0% {
      box-shadow: inset 0px -20px 20px -15px rgb(0, 0, 0, 0.1);
    }
    50% {
      box-shadow: inset 0px -20px 20px -15px rgb(0, 0, 0, 0.2);
    }
    100% {
      box-shadow: inset 0px -20px 20px -15px rgb(0, 0, 0, 0.1);
    }
  }
`;