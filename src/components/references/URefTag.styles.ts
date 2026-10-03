import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    color: var(--u-txt-color, #212121);
    font-size: 10px;
    border: 1px solid var(--u-border-color, #E0E0E0);
    border-radius: 9999px;
    background-color: var(--u-neutral-100);
    padding: 2px 6px;
    transition: background-color var(--u-duration-normal, 220ms) ease-in-out;
    cursor: pointer;
  }
  :host(:hover) {
    color: var(--u-txt-color-inverse, #FFFFFF);
    background-color: var(--u-bg-color-inverse, #212121);
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
