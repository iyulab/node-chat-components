import { css } from "lit";

export const styles = css`
  :host {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    min-width: 0;
    max-width: 200px;
    gap: 10px;
    padding: 8px 10px;
    border: 1px solid var(--u-border-color);
    border-radius: 8px;
    background-color: var(--u-neutral-50);
    overflow: visible;
    cursor: pointer;
    transition: background-color 0.12s ease, border-color 0.12s ease;
    font-size: 14px;
  }
  :host(:hover) {
    background-color: var(--u-neutral-100);
    border-color: var(--u-border-color-strong);
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
    transition: background 0.15s ease;
    overflow: hidden;
  }
  .thumbnail[clickable] {
    cursor: pointer;
  }
  .thumbnail img,
  .thumbnail video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
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
  .thumbnail:hover .download-btn {
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
  :host(:hover) .remove-btn {
    opacity: 1;
    pointer-events: auto;
  }
  .remove-btn:hover {
    background-color: var(--u-red-600);
  }

  /* ─── 미리보기 오버레이 ─── */

  .preview-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.92);
    cursor: default;
    animation: preview-fadeIn 0.2s ease;
  }

  .preview-header {
    height: 56px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
  }

  .preview-name {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.875em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .preview-close {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 12px;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
  }
  .preview-close:hover  { background: rgba(255, 255, 255, 0.18); }
  .preview-close:active { background: rgba(255, 255, 255, 0.28); }
  .preview-close u-icon { color: white; font-size: 1.25em; }

  .preview-body {
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 24px 24px;
  }
  .preview-body img,
  .preview-body video {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 6px;
  }

  @keyframes preview-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;
