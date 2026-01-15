import { css } from "lit";

export const styles = css`
  :host {
    display: flex;
  }

  .card {
    background: var(--card-background, var(--u-panel-bg-color));
    border: var(--card-border, 1px solid var(--u-border-color));
    border-radius: var(--card-border-radius, 8px);
    padding: var(--card-padding, 16px);
    min-width: 280px;
    max-width: 400px;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  .card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }

  .card-icon.blue u-icon {
    font-size: 20px;
    color: var(--u-blue-600);
  }

  .card-icon.green u-icon {
    font-size: 20px;
    color: var(--u-green-600);
  }

  .image {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    object-fit: contain;
  }

  .type-badge,
  .type-badge-link {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
    margin-left: auto;
  }

  .type-badge-link {
    display: flex;
    align-items: center;
    gap: 4px;
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .type-badge-link .badge-text {
    line-height: 1;
  }

  .type-badge-link u-icon {
    font-size: 12px;
  }

  .type-badge.web,
  .type-badge-link.web {
    color: var(--u-blue-700);
    background: var(--u-blue-0);
  }

  .type-badge-link.web:hover {
    background: var(--u-blue-100);
    color: var(--u-blue-800);
  }

  .type-badge.document,
  .type-badge-link.document {
    color: var(--u-green-700);
    background: var(--u-green-0);
  }

  .type-badge-link.document:hover {
    background: var(--u-green-100);
    color: var(--u-green-800);
  }

  .card-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .heading {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--u-txt-color);
    line-height: 1.4;
  }

  .snippet {
    font-size: 13px;
    color: var(--u-txt-color-weak);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .snippet:empty {
    display: none;
  }

  .tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 4px;
  }

  .tag {
    font-size: 11px;
    color: var(--u-txt-color-weak);
    background: var(--u-neutral-100);
    padding: 3px 8px;
    border-radius: 4px;
    white-space: nowrap;
  }
`;
