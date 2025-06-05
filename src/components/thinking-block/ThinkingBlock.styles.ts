import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    width: 100%;
    height: auto;

    --font-size: 14px;
    --line-height: 21px;
    --max-height: 260px;
  }
  :host([loading]) .header {
    cursor: wait;
  }
  :host([loading]) .body {
    height: calc(var(--line-height) * 3 + 14px);
    max-height: calc(var(--line-height) * 3 + 14px);
    overflow: hidden !important;
    animation: pulse 1.5s infinite;
    cursor: wait;
  }
  :host(:not([loading])[collapsed]) .body {
    max-height: 0;
    padding: 0;
    overflow: hidden;
  }

  .container {
    display: block;
    border-radius: 8px;
    border: 1px solid var(--uc-border-color-mid);
    box-sizing: border-box;
  }

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .header .title {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
  }
  .header .dots::after {
    content: '';
    animation: dots 1.5s infinite;
  }

  .body {
    height: auto;
    max-height: var(--max-height);
    font-weight: 300;
    font-size: var(--font-size);
    line-height: var(--line-height);
    padding: 14px;
    box-sizing: border-box;
    overflow: auto;
    overflow-wrap: anywhere;
    transition: max-height 0.3s ease, padding 0.3s ease;
  }

  @keyframes dots {
    0%, 20% { content: ''; }
    40% { content: '.'; }
    60% { content: '..'; }
    80%, 100% { content: '...'; }
  }

  @keyframes pulse {
    0% {
      box-shadow: inset 0px -20px 20px -15px var(--uc-shadow-color-low);
    }
    50% {
      box-shadow: inset 0px -20px 20px -15px var(--uc-shadow-color-high);
    }
    100% {
      box-shadow: inset 0px -20px 20px -15px var(--uc-shadow-color-low);
    }
  }
`;