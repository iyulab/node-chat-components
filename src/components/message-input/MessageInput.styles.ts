import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    font-size: 16px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    
    line-height: 1.5;
    --min-rows: 2;
    --max-rows: 10;
  }

  .container {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px 16px;
    box-sizing: border-box;
    border: 1px solid var(--uc-border-color-low);
    border-radius: 16px;
    background-color: var(--uc-background-color-0);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .input-area {
    position: relative;
    box-sizing: border-box;
    max-height: calc(var(--max-rows) * 1.5em);

    textarea {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      padding: 0;
      margin: 0;
      border: none;
      resize: none;
      outline: none;
      color: currentColor;
      background-color: transparent;
      font-size: inherit;
      line-height: inherit;
      font-family: inherit;
      overflow: auto;
    }

    .filler {
      min-height: calc(var(--min-rows) * 1.5em);
      display: block;
      visibility: hidden;
      pointer-events: none;
      font-size: inherit;
      line-height: inherit;
      word-break: break-word;
      white-space: pre-wrap;
    }
  }

  .control-area {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;

    .send-btn {
      font-size: 12px;
      color: var(--uc-background-color-0);
      background-color: var(--uc-background-color-1000);
    }
  }
`;