import { css } from 'lit';
import { visuallyHidden } from '../../utilities/visuallyHidden.js';

export const styles = css`
  :host {
    display: inline-flex;
    /* 위치 지정 — 안의 숨김 문구(절대 위치 · 1px)의 포함 블록이 이 요소가 된다. 없으면 포함 블록이 문서 전체라 호스트의
       overflow 감싸개를 건너뛰고 그 정적 위치에서 문서를 늘렸다(위치 지정되지 않은 스크롤 상자 안에서). */
    position: relative;
    color: var(--u-txt-color, #212121);
    font-size: max(var(--chat-min-font-size, 0px), calc(10em / 16));
    cursor: pointer;
  }
  /* 상자(여백 · 테두리 · 면)는 섀도 안 .base 가 그린다 — 호스트에 두면 문서의 전역 리셋(Tailwind preflight 류)이 이긴다. */
  .base {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    border: 1px solid var(--u-border-color, #E0E0E0);
    border-radius: 9999px;
    background-color: var(--u-neutral-100);
    padding: 2px 6px;
    transition: background-color var(--u-duration-normal, 220ms) ease-in-out;
  }
  :host(:hover) {
    color: var(--u-txt-color-inverse, #FFFFFF);
  }
  :host(:hover) .base {
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
    ${visuallyHidden}
  }
`;
