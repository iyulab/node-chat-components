import { css } from "lit";

export const styles = css`
  :host {
    margin: 0.75em auto;
    display: block;
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
  .toolbar-right u-button[title="Full Screen"] {
    font-size: 15px;
  }

  .viewport {
    position: relative;
    padding: 1em;
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
    border: 1px solid var(--u-red-200);
    border-radius: 6px;
    color: var(--u-red-800);
    font-size: 12px;
    pointer-events: none;
  }

  .error-overlay u-icon {
    color: var(--u-red-600);
    flex-shrink: 0;
  }
`;
