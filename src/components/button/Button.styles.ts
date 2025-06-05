import { css } from "lit";

export const styles = css`
  :host {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    border: 1px solid var(--uc-border-color-mid);
    border-radius: 8px;
    padding: 8px;
    font-size: 16px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--uc-background-color-0);
    
    transition: opacity 0.3s ease;
    box-sizing: border-box;
    user-select: none;
    cursor: pointer;
  }
  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }
  :host([loading]) .overlay {
    display: flex;
    pointer-events: none;
  }
  :host(:hover) {
    background-color: var(--uc-background-color-100);
  }

  .overlay {
    display: none;
    z-index: 100;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    align-items: center;
    justify-content: center;

    padding: inherit;
    font-size: inherit;
    border-radius: inherit;
    background-color: inherit;
  }

  .tooltip {
    display: block;
    z-index: 1000;
    position: absolute;
    width: max-content;
    top: 0;
    left: 0;
    
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 14px;

    background-color: var(--uc-background-color-1000);
    
    backdrop-filter: blur(5px);
    color: white;

    pointer-events: none;
    opacity: 0;
    transform: scale(0.9);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  .tooltip.visible {
    pointer-events: auto;
    opacity: 1;
    transform: scale(1);
  }
`;