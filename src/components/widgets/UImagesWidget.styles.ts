import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    width: 100%;
    margin: 0.75em 0;
  }

  /* ═══ 캐러셀 썸네일 ═══ */

  .slide {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    aspect-ratio: 4 / 3;
  }
  .slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    transition: filter 0.2s ease;
  }
  .slide:hover img {
    filter: brightness(0.92);
  }

  .caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px 10px 8px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.55));
    color: white;
    font-size: 0.8rem;
    line-height: 1.3;
  }

  /* ═══ 라이트박스 ═══ */

  .lb-overlay {
    position: fixed;
    inset: 0;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.92);
    animation: lb-fadeIn 0.2s ease;
  }

  @keyframes lb-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* 뷰포트: 클리핑 영역 */
  .lb-viewport {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  /* 트랙: 모든 슬라이드를 가로로 나열, translateX로 슬라이딩 */
  .lb-track {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: transform 0.45s cubic-bezier(0.25, 0.1, 0.25, 1);
    will-change: transform;
  }

  /* 각 슬라이드: 70vw 고정 폭 */
  .lb-slide {
    flex: 0 0 70vw;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity 0.4s ease, transform 0.4s ease;
  }
  .lb-slide:not(.active) {
    opacity: 0.5;
    transform: scale(0.92);
  }
  .lb-slide.active {
    opacity: 1;
    transform: scale(1);
    cursor: default;
  }
  .lb-slide img {
    max-width: 100%;
    max-height: 85vh;
    object-fit: contain;
    border-radius: 6px;
    user-select: none;
    pointer-events: none;
  }

  /* ─── 라이트박스 UI ─── */

  u-icon[lib="internal"] {
    color: inherit;
  }

  .lb-close {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 1;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 12px;
    color: white;
    background: transparent;
    font-size: 1.25rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    backdrop-filter: blur(4px);
  }
  .lb-close:hover {
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.15);
  }

  .lb-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    color: white;
    font-size: 1.25rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    backdrop-filter: blur(4px);
  }
  .lb-nav:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  .lb-nav.prev { left: 16px; }
  .lb-nav.next { right: 16px; }

  .lb-counter {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.85rem;
    font-variant-numeric: tabular-nums;
  }

  .lb-caption {
    position: absolute;
    bottom: 44px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
    max-width: 80vw;
    text-align: center;
  }
`;
