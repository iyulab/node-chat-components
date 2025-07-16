import { css } from "lit";

export const styles = css`
  :host {
    position: relative;
    padding: 8px;
    font-size: 16px;
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
  }
  :host(:hover) {
    background-color: var(--uc-background-color-200);
  }
  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
    background-color: transparent;
    cursor: not-allowed;
  }
  /* uc-icon 스타일 */
  :host([value="low"]) uc-icon {
    filter: brightness(0.8);
    color: var(--uc-yellow-color-500);
  }
  :host([value="medium"]) uc-icon {
    color: var(--uc-yellow-color-500);
  }
  :host([value="high"]) uc-icon {
    color: var(--uc-yellow-color-500);
  }
  /* indicators 스타일 */
  :host([value="low"]) .indicators > span:last-child {
    background-color: var(--uc-yellow-color-500);
  }
  :host([value="medium"]) .indicators > span:nth-last-child(-n+2) {
    background-color: var(--uc-yellow-color-500);
  }
  :host([value="high"]) .indicators > span {
    background-color: var(--uc-yellow-color-500);
  }

  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
  }

  uc-icon {
    font-size: inherit;
    color: #e0e0e0;
    transition: color 0.3s ease, filter 0.3s ease;
  }

  .indicators {
    height: 1em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
  .indicators > span {
    width: 0.5em;
    height: 0.2em;
    border-radius: 2px;
    background-color: #e0e0e0;
    transition: background-color 0.3s ease;
  }
`;
