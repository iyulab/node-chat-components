import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-flex;
  }

  .citation-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5rem;
    height: 1.5rem;
    padding: 0 0.375rem;
    border-radius: 0.25rem;
    background-color: var(--u-citation-bg-color, #e5e7eb);
    color: var(--u-citation-txt-color, #374151);
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s ease;
  }

  .citation-tag:hover {
    background-color: var(--u-citation-bg-color-hover, #d1d5db);
  }

  .tooltip-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-width: 200px;
    max-width: 300px;
  }

  .tooltip-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--u-border-color, #e5e7eb);
  }

  .pagination {
    flex: 1;
    text-align: center;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--u-txt-color, #111827);
  }

  .tooltip-body {
    display: flex;
    gap: 0.75rem;
  }

  .citation-icon {
    flex-shrink: 0;
    font-size: 1.25rem;
    color: var(--u-icon-color, #6b7280);
  }

  .citation-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
  }

  .citation-title {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--u-txt-color, #111827);
    word-wrap: break-word;
  }

  .citation-title a {
    color: var(--u-link-color, #3b82f6);
    text-decoration: none;
  }

  .citation-title a:hover {
    text-decoration: underline;
  }

  .citation-snippet {
    font-size: 0.8125rem;
    line-height: 1.5;
    color: var(--u-txt-color-secondary, #6b7280);
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
`;
