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
    transition: all var(--u-duration-normal, 220ms) ease;
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

  /* 출처 미리보기 — 본문 위, 카드 폭 안. 도표·그림이 잘리지 않게 담는다(contain). */
  .preview {
    display: block;
    align-self: flex-start;
    max-width: 100%;
    max-height: 160px;
    margin-top: 8px;
    object-fit: contain;
    border-radius: 4px;
  }
  .preview-blocked {
    margin-top: 8px;
    color: var(--u-txt-color-weak);
    font-size: 12px;
    line-height: 1.5;
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
  /* 새 창 알림 — 화면에는 없고 접근성 이름에만 붙는다(KWCAG 7.2.1). */
  .new-tab-hint {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }
`;
