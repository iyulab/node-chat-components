import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    width: 380px;
    padding: 6px;
    border: 1px solid var(--u-border-color);
    border-radius: 8px;
    background: var(--u-panel-bg-color);
  }

  a {
    display: flex;
    flex-direction: column;
    padding: 6px;
    color: inherit;
    text-decoration: none;
    transition: all 0.2s ease;
  }
  a:hover {
    color: var(--u-txt-color-hover, #1565C0);
    background-color: var(--u-neutral-50);
  }

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .favicon {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }

  .title {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .badge {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    line-height: 1;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 4px;
    white-space: nowrap;
  }
  .badge[type="web"] {
    color: var(--u-info-color-strong, #1565C0);
    background: var(--u-blue-0);
  }
  .badge[type="document"] {
    color: var(--u-success-color-strong, #1B5E20);
    background: var(--u-green-0);
  }
  .badge u-icon {
    color: inherit;
  }

  .body {
    display: -webkit-box;
    color: var(--u-txt-color-weak);
    font-size: 12px;
    line-height: 1.5;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 8px;
  }

  .footer {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    margin-top: 8px;
  }

  .tag {
    font-size: 10px;
    line-height: 1.4;
    color: var(--u-txt-color-weak);
    background: var(--u-neutral-100);
    padding: 2px 6px;
    border-radius: 4px;
    white-space: nowrap;
  }
`;
