import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-block;
    color: var(--u-neutral-700, #3c4043);
    font-size: 12px;
    border: 1px solid var(--u-neutral-300, #dfe1e5);
    border-radius: 9999px;
    background-color: var(--u-neutral-100, #f8f9fa);
    padding: 2px 6px;
    position: relative;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }
  :host(:hover) {
    background-color: var(--u-neutral-200, #e8eaed);
  }

  a {
    all: unset;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  
  u-icon {
    position: absolute;
    top: 50%;
    right: 6px;
    transform: translateY(-50%);
    flex-shrink: 0;
    background-color: transparent;
    color: var(--u-neutral-500, #5f6368);
    backdrop-filter: blur(4px);
  }
`;
