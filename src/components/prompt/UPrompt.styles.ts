import { css } from "lit";

export const styles = css`
  :host {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 12px;
    border: 1px solid var(--u-border-color);
    border-radius: 8px;
    background-color: var(--u-bg-color);
  }
  :host(:focus-within) {
    outline: none;
    border-color: var(--u-border-color-strong);
    box-shadow: 0 0 0 1px var(--u-border-color-weak);
  }
  :host([loading])::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 10px;
    padding: 2px;
    background: linear-gradient(90deg,
      transparent 0%,
      transparent 25%,
      #f9a8d4 45%,
      #fbbf24 55%,
      transparent 75%,
      transparent 100%
    );
    background-size: 300% 100%;
    animation: border-shimmer 2s linear infinite;
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  .files {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
  }
  .files u-file-block {
    flex: 0 1 auto;
  }

  .input {
    flex: 1;
    padding: 8px;
  }

  .control {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .send-btn {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    padding: 0;
    font-size: 16px;
    border-radius: 50%;
  }

  @keyframes border-shimmer {
    0%   { background-position: 100% 0; }
    100% { background-position: 0% 0; }
  }
`;
