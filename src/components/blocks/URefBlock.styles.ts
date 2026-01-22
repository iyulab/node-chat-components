import { css } from "lit";

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  /* 헤더 영역 */
  .header {
    all: unset;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0.5em;
    color: var(--u-txt-color-strong);
    user-select: none;
    cursor: pointer;
  }
  .header:hover {
    color: var(--u-txt-color-hover);
  }
  .header:focus-visible {
    outline: 2px solid rgba(100, 150, 250, 0.6);
    outline-offset: 2px;
  }

  u-icon {
    color: inherit;
    font-size: 1em;
    transition: transform 0.2s ease-in-out;
  }
  u-icon[collapsed] {
    transform: rotate(-90deg);
  }

  .title {
    color: inherit;
    font-size: 1em;
    line-height: 1.5;
    font-weight: 600;
    color: var(--u-text-color-weak);
  }

  .count {
    color: inherit;
    font-size: 0.75em;
    font-weight: 400;
    line-height: 2em;
  }

  /* 바디 영역 */
  .body {
    display: flex;
    flex-direction: column;
    gap: 0.75em;
    margin-top: 0.75em;
    transition: all 0.3s ease-in-out;
  }
  .body[collapsed] {
    height: 0;
    opacity: 0;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  .body u-ref-card {
    width: 100%;
  }
`;
