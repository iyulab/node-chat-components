import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    width: 100%;
    margin: 0.75em 0;
  }

  .slide {
    position: relative;
    display: block;
    inline-size: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    color: inherit;
    text-align: start;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    aspect-ratio: 4 / 3;
  }
  .slide:focus-visible {
    outline: 2px solid var(--u-primary-color, #1976D2);
    outline-offset: 2px;
  }
  .slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    transition: transform var(--u-duration-slow, 320ms) ease, filter var(--u-duration-slow, 320ms) ease;
  }
  .slide:hover img {
    transform: scale(1.05);
    filter: brightness(0.92);
  }

  /* 출처 정책이 막은 이미지 — 요청 없이 대체 텍스트만. */
  .slide.blocked {
    display: grid;
    place-items: center;
    padding: 8px;
    box-sizing: border-box;
    border: 1px dashed var(--u-border-color, #E0E0E0);
    color: var(--u-txt-color-weak, #616161);
    font-size: max(var(--chat-min-font-size, 0px), 0.8em);
    text-align: center;
    cursor: default;
  }

  .caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px 10px 8px;
    color: white;
    font-size: max(var(--chat-min-font-size, 0px), 0.8em);
    line-height: 1.3;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.55));
  }

  /* ─── 라이트박스 UI ─── */

  /* 루트 오버레이: flex column 전체 화면 */
  .lb-overlay {
    position: fixed;
    inset: 0;
    z-index: var(--u-layer-overlay, 9999);
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.92);
    animation: overlay-fadeIn var(--u-duration-normal, 220ms) ease;
  }

  /* 상단 헤더: 카운터(중앙) + 닫기(우측) */
  .lb-header {
    height: 56px;
    position: relative;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lb-counter {
    color: rgba(255, 255, 255, 0.75);
    font-size: max(var(--chat-min-font-size, 0px), 0.875em);
    font-variant-numeric: tabular-nums;
    background: rgba(0, 0, 0, 0.35);
    padding: 3px 12px;
    border-radius: 20px;
    backdrop-filter: blur(4px);
  }

  .lb-close {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    /* 호스트 하한(--u-target-size)이 더 크면 그 값. */
    width: max(36px, var(--u-target-size, 0px));
    height: max(36px, var(--u-target-size, 0px));
    border: none;
    border-radius: 12px;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background var(--u-duration-normal, 220ms);
  }
  .lb-close:hover  {
    background: rgba(255, 255, 255, 0.18);
  }
  .lb-close:active {
    background: rgba(255, 255, 255, 0.28);
  }

  .lb-close u-icon {
    color: white;
    font-size: 1.25em;
  }

  /* 중앙 본문: 뷰포트 + 이전/다음 버튼(absolute 오버레이) */
  .lb-body {
    position: relative;
    flex: 1;
    min-height: 0;
  }

  .lb-viewport {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .lb-track {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    transition: transform var(--u-duration-slow, 320ms) cubic-bezier(0.25, 0.1, 0.25, 1);
    will-change: transform;
  }

  .lb-slide {
    flex: 0 0 70vw;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.5;
    transform: scale(0.9);
    transition: opacity var(--u-duration-slow, 320ms) ease, transform var(--u-duration-slow, 320ms) ease;
  }
  .lb-slide[active] {
    opacity: 1;
    transform: scale(1);
  }
  .lb-slide img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 6px;
    user-select: none;
    pointer-events: none;
  }
  .lb-blocked {
    padding: 16px 24px;
    border: 1px dashed rgba(255, 255, 255, 0.5);
    border-radius: 6px;
    color: white;
  }

  .lb-nav {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: 80px;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background var(--u-duration-normal, 220ms);
  }
  .lb-nav.prev {
    left: 0;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.28), transparent);
  }
  .lb-nav.next {
    right: 0;
    background: linear-gradient(to left, rgba(0, 0, 0, 0.28), transparent);
  }
  .lb-nav.prev:hover {
    background: linear-gradient(to right, rgba(0, 0, 0, 0.5), transparent);
  }
  .lb-nav.next:hover {
    background: linear-gradient(to left, rgba(0, 0, 0, 0.5), transparent);
  }

  .lb-nav u-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5em;
    padding: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    transition: background var(--u-duration-normal, 220ms), transform var(--u-duration-fast, 140ms);
  }
  .lb-nav:hover u-icon {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  /* 하단 푸터: 캡션 */
  .lb-footer {
    position: relative;
    flex-shrink: 0;
    padding: 24px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.72));
  }

  .lb-caption {
    margin: 0;
    color: white;
    font-size: 1.05em;
    line-height: 1.5;
    text-align: center;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
  }

  @keyframes overlay-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;
