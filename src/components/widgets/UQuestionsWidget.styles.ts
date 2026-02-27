import { css } from "lit";

export const styles = css`
  :host {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.4em;
    margin: 0.75em 0;
  }

  button {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.5em 0.75em;
    font-size: 0.875em;
    text-align: left;
    line-height: 1.4;
    color: var(--u-txt-color);
    border: 1px solid var(--u-border-color);
    border-radius: 10px;
    background: var(--u-bg-color);
    box-shadow: 0 1px 2px var(--u-shadow-color-weaker);
    transition: all 0.15s ease;
    cursor: pointer;
  }
  button:hover {
    background: var(--u-blue-0);
    border-color: var(--u-blue-400);
    transform: translateY(-1px);
  }
  button:active {
    transform: translateY(0);
  }

  span {
    flex: 1;
    min-width: 0;
  }
`;
