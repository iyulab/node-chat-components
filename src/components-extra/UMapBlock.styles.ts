import { css } from "lit";

export const styles = css`
  /* 🔴호스트를 «세로 flex» 로 둔다 — display:block 이면 아래 iframe 의 300px 이
     호스트의 max-height 에 참여하지 못한다. 실측: 호스트 120 에서 지도가 300 그대로였고
     180px 이 overflow:hidden 에 잘렸다(스크롤도 없어 도달 불가).
     계약은 tests/browser/extra-block-size-model.browser.test.ts 가 고정한다. */
  :host {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    margin: 0.75em 0;
  }

  iframe {
    width: 100%;
    /* ⚠이 300px 은 «고정» 이 아니라 «제약이 없을 때의 기본» 이다 — flex-basis 가 auto 라
       선언이 그대로 기본값이 되고, 호스트가 제약을 주면 flex 가 그것을 이긴다.
       (이름과 값을 유지하고 의미만 재정의한 것은 u-widgets 의 차트 높이와 같은 처리다.) */
    height: 300px;
    flex: 1 1 auto;
    min-height: 0;
    display: block;
    border: none;
  }

  .caption {
    text-decoration: none;
    max-width: 60%;
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    flex-direction: column;
    gap: 0.25em;
    padding: 0.25em 0.5em;
    color: #fff;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 6px;
    backdrop-filter: blur(4px);
  }
  .caption:hover {
    background: rgba(0, 0, 0, 0.8);
  }
  .caption strong {
    font-size: 0.8em;
  }
  .caption span {
    font-size: 0.7em;
    opacity: 0.8;
  }
`;
