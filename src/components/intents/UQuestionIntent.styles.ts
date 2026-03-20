import { css } from "lit";

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    margin: 0.75em 0;
  }

  .question {
    margin: 0 0 0.25em;
    font-size: 0.9em;
    color: var(--u-txt-color-weak);
    line-height: 1.5;
  }

  .choices {
    display: flex;
    flex-direction: column;
    gap: 0.4em;
  }

  u-button {
    display: block;
    width: fit-content;
    padding: 0.5em 0.75em;
    font-size: 0.875em;
    justify-content: flex-start;
    line-height: 1.4;
    border-radius: 10px;
    box-shadow: 0 1px 2px var(--u-shadow-color-weaker);
    transition: all 0.15s ease;
  }
  u-button:hover {
    background-color: var(--u-blue-0);
    border-color: var(--u-blue-400);
    transform: translateY(-1px);
  }
  u-button:active {
    transform: translateY(0);
  }
`;
