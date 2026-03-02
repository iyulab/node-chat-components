import { css } from "lit";

export const styles = css`
  /* ── 호스트가 곧 그리드 컨테이너 ───────────────────────────── */
  :host {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 6px;
    font-size: 14px;
    width: 100%;
  }

  /* ── 아이템 ─────────────────────────────────────────────────── */
  .item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border: 1px solid var(--u-border-color);
    border-radius: 8px;
    background-color: var(--u-neutral-50);
    overflow: visible;
    transition: background-color 0.12s ease, border-color 0.12s ease;
    min-width: 0;
  }
  .item:hover {
    background-color: var(--u-neutral-100);
    border-color: var(--u-border-color-strong);
  }

  /* ── 아이콘 영역 (다운로드 버튼 overlay 기준) ──────────────── */
  .icon-wrap {
    position: relative;
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background-color: var(--u-neutral-200);
    font-size: 16px;
    color: var(--u-icon-color);
  }

  /* ── 파일 정보 ──────────────────────────────────────────────── */
  .info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .name {
    font-size: 13px;
    font-weight: 500;
    color: var(--u-txt-color-strong);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--u-txt-color-weak);
  }

  .type-badge {
    padding: 1px 5px;
    border-radius: 4px;
    background-color: var(--u-neutral-200);
    color: var(--u-txt-color-weak);
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .size {
    font-variant-numeric: tabular-nums;
  }

  /* ── 다운로드 버튼: 아이콘 위에 overlay, hover 시 등장 ──────── */
  .download-btn {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    border-radius: 6px;
    border-color: transparent !important;
    background-color: color-mix(in srgb, var(--u-neutral-900) 70%, transparent) !important;
    color: var(--u-neutral-0) !important;
    font-size: 14px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease;
  }
  .item:hover .download-btn {
    opacity: 1;
    pointer-events: auto;
  }
  .download-btn:hover {
    background-color: color-mix(in srgb, var(--u-neutral-900) 85%, transparent) !important;
  }

  /* ── 삭제 버튼: 아이템 오른쪽 위 절대 배치, hover 시 등장 ───── */
  .remove-btn {
    position: absolute;
    top: -9px;
    right: -9px;
    width: 20px;
    height: 20px;
    min-width: 20px;
    padding: 0;
    border-radius: 50%;
    font-size: 10px;
    line-height: 1;
    background-color: var(--u-neutral-600) !important;
    border-color: transparent !important;
    color: var(--u-neutral-0) !important;
    z-index: 1;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.12s ease, background-color 0.12s ease;
  }
  .item:hover .remove-btn {
    opacity: 1;
    pointer-events: auto;
  }
  .remove-btn:hover {
    background-color: var(--u-red-600) !important;
  }
  .remove-btn:active {
    background-color: var(--u-red-700) !important;
  }
`;