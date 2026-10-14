import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    /* 글자는 글자 토큰에서 읽는다(#1281) — 토큰 시트가 없으면 종전 크기(16px · 1.5)다. */
    font-family: var(--u-font-base, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
    font-size: var(--u-text-body-size, 16px);
    font-weight: 400;
    line-height: var(--u-text-body-leading, 1.5);
    color: currentColor;
    background-color: transparent;
  }

  /* 터치 기기에서 편집 칸의 글자가 16px 아래면 iOS Safari 가 포커스 때 화면을 확대한다 — 편집 중에만 하한을 둔다. */
  @media (pointer: coarse) {
    :host([editable]) {
      font-size: max(16px, var(--u-text-body-size, 16px));
    }
  }

  .container {
    position: relative;
    display: block;
    overflow: hidden;
  }

  textarea {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    display: block;
    border: none;
    outline: none;
    resize: none;
    color: inherit;
    background-color: inherit;
    
    /* 동일 스타일 크기 싱크 */
    margin: 0;
    padding: 0;
    /* 산문이다 — 폭에 맞춰 접는다(#1284: 좁은 채팅 패널에서 가로 스크롤로 잘렸다). 크기 재기용 pre 와 같은 규칙. */
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    overflow: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--u-scrollbar-color) transparent;
  }
  textarea[readonly] {
    cursor: default;
  }

  /* 숨김 처리 */
  pre {
    visibility: hidden;
    position: relative;
    display: block;

    /* 동일 스타일 크기 싱크 */
    margin: 0;
    padding: 0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    overflow: auto;
    scrollbar-width: thin;

    pointer-events: none;
    min-height: 1.5em;
  }
`;