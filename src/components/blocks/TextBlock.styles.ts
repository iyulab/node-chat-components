import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    padding: 8px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
    color: currentColor;
    background-color: transparent;
  }

  .container {
    position: relative;
    display: block;
    overflow: hidden;
  }

  textarea {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    display: block;
    border: none;
    outline: none;
    resize: none;
    color: inherit;
    background-color: inherit;
    
    /* 동일 스타일 크기 싱크 */
    margin: 0;
    padding: 0;
    white-space: pre;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    overflow: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--uc-scrollbar-color) transparent;
  }
  textarea[readonly] {
    cursor: default;
  }

  /* 숨김 처리 */
  pre {
    visibility: hidden;
    position: relative;
    display: block;
    color: red;

    /* 동일 스타일 크기 싱크 */
    margin: 0;
    padding: 0;
    white-space: pre;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    overflow: auto;
    scrollbar-width: thin;

    pointer-events: none;
    min-height: 1.5em;
  }
`;