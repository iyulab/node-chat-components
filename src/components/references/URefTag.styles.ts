import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-flex;
    /* 위치 지정 — 안의 숨김 문구(절대 위치 · 1px)의 포함 블록이 이 요소가 된다. 없으면 포함 블록이 문서 전체라 호스트의
       overflow 감싸개를 건너뛰고 그 정적 위치에서 문서를 늘렸다(위치 지정되지 않은 스크롤 상자 안에서). */
    position: relative;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    color: var(--u-txt-color, #212121);
    font-size: calc(10em / 16);
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
