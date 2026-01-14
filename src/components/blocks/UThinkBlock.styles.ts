import { css } from "lit";

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    width: 100%;
    font-size: 14px;
    border: 1px solid var(--u-border-color);
    border-radius: 8px;
  }

  .header {
    width: 100%;
    padding: 8px;
    border-radius: inherit;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    user-select: none;
    cursor: pointer;
  }
  .header:hover {
    background: linear-gradient(var(--u-neutral-100), transparent);
  }
  .header:active {
    background: linear-gradient(var(--u-neutral-200), transparent);
  }

  .header .prefix-icon {
    color: var(--u-yellow-800);
    transition: all 0.3s ease-in-out;
  }
  .header .prefix-icon[loading] {
    animation: pulse-glow 3s ease-in-out infinite;
  }
  .header .title {
    flex: 1;
    font-size: inherit;
    font-weight: 600;
    line-height: 1;
  }

  .body {
    font-size: inherit;
    font-weight: 300;
    line-height: 1.5;
    padding: 8px;
    max-height: 210px;
    overflow: auto;
  }
  .body u-marked-block {
    font-size: inherit;
    font-family: inherit;
    line-height: inherit;
  }

  @keyframes pulse-glow {
    0%, 100% {
      opacity: 1;
      filter: brightness(1);
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      filter: brightness(1.3);
      transform: scale(1.1);
    }
  }
`;