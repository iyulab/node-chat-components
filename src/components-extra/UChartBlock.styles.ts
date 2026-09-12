import { css } from "lit";

export const styles = css`
  /* 🔴호스트를 «세로 flex» 로 둔다 — display:block 이면 사슬이 여기서 끊긴다.
     내부는 툴바(고정) + 뷰포트(가변) 구조인데, 호스트가 block 이면 그 둘이 호스트의
     max-height 에 참여하지 못해 호스트만 줄고 뷰포트는 제 높이를 유지한다.
     그러면 overflow:hidden 에 잘리고 스크롤도 없어 도달할 수 없다 — 실측(자연 368):
     호스트 120 에서 뷰포트가 316 그대로였고 248px 이 잘렸다.
     계약은 tests/browser/extra-block-size-model.browser.test.ts 가 고정한다. */
  :host {
    margin: 0.75em auto;
    display: flex;
    flex-direction: column;
    width: 100%;
    background: var(--u-bg-color);
    border: 1px solid var(--u-border-color);
    border-radius: 8px;
    overflow: hidden;
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 12px;
    background-color: var(--u-neutral-100);
    border-bottom: 1px solid var(--u-border-color);
    gap: 8px;
    /* 툴바는 줄어들지 않는다 — 제약이 들어오면 차트가 양보한다. */
    flex: none;
  }

  .toolbar-left {
    flex: 1;
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .toolbar-right u-button {
    font-size: 12px;
  }
  .toolbar-right u-button.fullscreen-btn {
    font-size: 15px;
  }

  .viewport {
    position: relative;
    padding: 1em;
    /* ⚠min-height:0 이 없으면 flex 아이템의 기본 min-height:auto 가 «줄어들지 않음» 이라
       위 사슬이 그대로 무효가 된다(이 리포가 여러 번 밟은 자리). */
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
  }

  .viewport:fullscreen {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--u-bg-color);
    padding: 2em;
  }
  .viewport:fullscreen canvas {
    max-width: 90vw;
    max-height: 90vh;
  }

  canvas {
    width: 100% !important;
    min-height: 60px;
  }

  .error-overlay {
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    background: var(--u-red-0);
    border: 1px solid var(--u-danger-color-weakest, #EF9A9A);
    border-radius: 6px;
    color: var(--u-danger-color-strong, #C62828);
    font-size: 12px;
    pointer-events: none;
  }

  .error-overlay u-icon {
    color: var(--u-danger-color, #D32F2F);
    flex-shrink: 0;
  }
`;
