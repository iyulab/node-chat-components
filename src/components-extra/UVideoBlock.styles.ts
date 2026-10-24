import { css } from "lit";

export const styles = css`
  :host {
    --video-ratio: 16 / 9;
  }

  :host {
    display: block;
    position: relative;
    width: 100%;
  }
  /* 상자(여백 · 테두리 · 면)는 섀도 안 .base 가 그린다 — 호스트에 두면 문서의 전역 리셋(Tailwind preflight 류)이 이긴다. */
  .base {
    position: relative;
    max-width: 800px;
    margin: 0.75em auto;
  }

  video {
    width: 100%;
    aspect-ratio: var(--video-ratio);
    border-radius: 8px;
    background: #000;
  }

  .video-wrapper {
    width: 100%;
    aspect-ratio: var(--video-ratio);
  }

  .video-wrapper iframe {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 8px;
  }
`;
