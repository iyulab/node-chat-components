import { css } from "lit";

export const styles = css`
  :host {
    display: block;
  }

  .card-group {
    display: flex;
    flex-direction: column;
    background: var(--u-panel-bg-color);
    border-radius: 8px;
    overflow: hidden;
  }

  .navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    background: var(--u-neutral-100);
  }

  .nav-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid var(--u-border-color);
    background: var(--u-bg-color);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--u-txt-color);
  }

  .nav-button:hover:not(:disabled) {
    background: var(--u-blue-0);
    border-color: var(--u-blue-600);
    color: var(--u-blue-600);
  }

  .nav-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .nav-button u-icon {
    font-size: 16px;
  }

  .page-indicator {
    font-size: 13px;
    font-weight: 600;
    color: var(--u-txt-color-weak);
    user-select: none;
  }

  .divider {
    height: 1px;
    background: var(--u-border-color);
  }

  .card-container {
    padding: 0;
  }

  .card-container ::slotted(u-ref-card) {
    /* display: block; */
    /* 그룹 내부 카드는 테두리와 배경 제거 */
    --card-border: none;
    --card-background: transparent;
    --card-border-radius: 0;
    --card-padding: 16px;
  }
`;
