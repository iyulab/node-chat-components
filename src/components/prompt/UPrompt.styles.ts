import { css } from "lit";

export const styles = css`
  :host {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 12px;
    border: 1px solid var(--u-border-color, #e0e0e0);
    border-radius: 8px;
    background-color: var(--u-bg-color);
  }
  :host(:focus-within) {
    outline: none;
    border-color: var(--u-neutral-400, #9ca3af);
    box-shadow: 0 0 0 1px var(--u-neutral-200, #9ca3af);
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
    font-size: 16px;
    color: var(--u-neutral-0);
    background-color: var(--u-neutral-800);
  }
  .send-btn[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @keyframes border-shimmer {
    0%   { background-position: 100% 0; }
    100% { background-position: 0% 0; }
  }
`;
