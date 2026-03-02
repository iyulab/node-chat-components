import { css } from "lit";

export const styles = css`
  :host {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 6px;
    font-size: 14px;
    width: 100%;
  }

  .item {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    min-width: 0;
    gap: 10px;
    padding: 8px 10px;
    border: 1px solid var(--u-border-color);
    border-radius: 8px;
    background-color: var(--u-neutral-50);
    overflow: visible;
    cursor: pointer;
    transition: background-color 0.12s ease, border-color 0.12s ease;
  }
  .item:hover {
    background-color: var(--u-neutral-100);
    border-color: var(--u-border-color-strong);
  }

  /* uploading */
  .item[phase="uploading"] {
    border-color: var(--u-blue-400);
    background-color: var(--u-blue-0);
    cursor: default;
  }
  .item[phase="uploading"] .thumbnail {
    background-color: var(--u-blue-100);
    color: var(--u-blue-600);
  }
  .item[phase="uploading"]:hover {
    background-color: var(--u-blue-0);
    border-color: var(--u-blue-400);
  }

  /* error */
  .item[phase="error"] {
    border-color: var(--u-red-400);
    background-color: var(--u-red-0);
  }
  .item[phase="error"] .thumbnail {
    background-color: var(--u-red-100);
    color: var(--u-red-600);
  }
  .item[phase="error"]:hover {
    background-color: var(--u-red-0);
    border-color: var(--u-red-500);
  }

  .thumbnail {
    position: relative;
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--u-icon-color);
    font-size: 16px;
    border-radius: 6px;
    background-color: var(--u-neutral-200);
  }

  .thumbnail-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    font-size: 14px;
    background-color: color-mix(in srgb, currentColor 15%, transparent);
  }
  .item[phase="uploading"] .thumbnail-overlay {
    animation: pulse 1.4s ease-in-out infinite;
  }

  .info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .name {
    font-size: 13px;
    font-weight: 500;
    color: var(--u-txt-color-strong);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .meta {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    color: var(--u-txt-color-weak);
    font-size: 10px;
  }

  .type {
    padding: 1px 5px;
    border-radius: 4px;
    background-color: var(--u-neutral-200);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .size {
    font-variant-numeric: tabular-nums;
  }

  .error-msg {
    display: flex;
    align-items: center;
    gap: 3px;
    color: var(--u-red-600);
    font-size: 10px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .upload-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    border-radius: 0 0 8px 8px;
    border: none;
    overflow: hidden;
  }
  .upload-progress::part(indicator) {
    background-color: var(--u-blue-500);
    border-radius: 0 0 8px 8px;
  }

  .download-btn {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    color: var(--u-neutral-0);
    font-size: 14px;
    border-radius: 6px;
    background-color: color-mix(in srgb, var(--u-neutral-900) 70%, transparent);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease;
  }
  .item:hover .download-btn {
    opacity: 1;
    pointer-events: auto;
  }
  .download-btn:hover {
    background-color: color-mix(in srgb, var(--u-neutral-900) 85%, transparent);
  }

  .remove-btn {
    position: absolute;
    z-index: 10;
    top: -8px;
    right: -8px;
    border-radius: 50%;
    font-size: 10px;
    background-color: var(--u-neutral-600);
    color: var(--u-neutral-0);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.12s ease, background-color 0.12s ease;
  }
  .item:hover .remove-btn {
    opacity: 1;
    pointer-events: auto;
  }
  .remove-btn:hover {
    background-color: var(--u-red-600);
  }
  .remove-btn:active {
    background-color: var(--u-red-700);
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
`;
