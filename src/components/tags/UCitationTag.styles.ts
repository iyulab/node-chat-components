import { css } from "lit";

export const styles = css`
  :host {
    display: inline-block;
    position: relative;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 2px 6px;
    border: 1px solid var(--u-primary-500, #3b82f6);
    border-radius: 4px;
    background-color: var(--u-primary-50, #eff6ff);
    color: var(--u-primary-700, #1d4ed8);
    font-size: 0.75rem;
    line-height: 1;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .tag:hover {
    background-color: var(--u-primary-100, #dbeafe);
    border-color: var(--u-primary-600, #2563eb);
  }

  .tag u-icon {
    font-size: 0.625rem;
  }

  .index {
    font-weight: 500;
  }

  .detail {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    min-width: 300px;
    max-width: 400px;
    padding: 12px;
    border: 1px solid var(--u-neutral-200, #e5e7eb);
    border-radius: 8px;
    background-color: var(--u-neutral-0, #ffffff);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    z-index: 10;
  }

  .detail-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .detail-header u-icon {
    font-size: 1rem;
    color: var(--u-neutral-500, #6b7280);
  }

  .detail-title {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--u-neutral-900, #111827);
    flex: 1;
  }

  .detail-snippet {
    padding: 8px;
    margin-bottom: 8px;
    border-radius: 4px;
    background-color: var(--u-neutral-50, #f9fafb);
    font-size: 0.75rem;
    line-height: 1.5;
    color: var(--u-neutral-700, #374151);
  }

  .detail-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    font-size: 0.75rem;
    color: var(--u-neutral-500, #6b7280);
  }

  .detail-link {
    color: var(--u-primary-600, #2563eb);
    text-decoration: none;
  }

  .detail-link:hover {
    text-decoration: underline;
  }

  .detail-date {
    color: var(--u-neutral-400, #9ca3af);
  }

  :host([expanded]) .tag {
    background-color: var(--u-primary-100, #dbeafe);
    border-color: var(--u-primary-600, #2563eb);
  }
`;
