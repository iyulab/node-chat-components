import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    color: var(--u-neutral-800);
    font-size: 10px;
    border: 1px solid var(--u-neutral-300);
    border-radius: 9999px;
    background-color: var(--u-neutral-100);
    padding: 2px 6px;
    transition: background-color 0.2s ease-in-out;
    cursor: pointer;
  }
  :host(:hover) {
    color: var(--u-neutral-100);
    background-color: var(--u-neutral-900);
  }

  a {
    min-width: 1em;
    max-width: 6em;
    display: inline-block;
    text-decoration: none;
    color: inherit;
    line-height: 1.5;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  u-icon {
    color: inherit;
    font-size: inherit;
  }

  u-tooltip {
    padding: 0;
    border: none;
    background-color: transparent;
    box-shadow: none;
  }
  u-tooltip[visible] {
    opacity: 1;
  }
`;
