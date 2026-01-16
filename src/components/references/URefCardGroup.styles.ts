import { css } from "lit";

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    width: 380px;
    border: 1px solid var(--u-border-color);
    border-radius: 8px;
    background: var(--u-panel-bg-color);
    overflow: hidden;
  }

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 6px 8px;
    color: var(--u-txt-color-weak);
    background-color: var(--u-neutral-100);
    border-bottom: 1px solid var(--u-border-color);
    user-select: none;
  }

  .nav-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    background-color: transparent;
    color: inherit;
    font-size: 16px;
    cursor: pointer;
  }
  .nav-button:hover u-icon {
    opacity: 0.6;
  }
  .nav-button u-icon {
    color: inherit;
  }

  .page-indicator {
    font-size: 12px;
    font-weight: 600;
  }

  .viewport {
    width: 100%;
    overflow: hidden;
  }

  .track {
    display: flex;
    flex-direction: row;
    width: 100%;
    will-change: transform;
    transition: transform 260ms ease;
  }

  /* slot 안의 각 카드가 한 페이지(100%)를 차지하도록 */
  ::slotted(u-ref-card) {
    flex: 0 0 100%;
    border: none;
  }
`;
