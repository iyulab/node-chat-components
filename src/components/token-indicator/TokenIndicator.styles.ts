import { css } from "lit";

export const styles = css`
  :host {
    position: relative;
    display: block;
    font-size: 18px;
    padding: 8px;

    border: 1px solid var(--uc-border-color-low);
    border-radius: 8px;
    background-color: var(--uc-background-color-0);
    box-shadow: 0 1px 3px var(--uc-shadow-color-low);
    user-select: none;
  }
  :host([type='button']) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background-color: transparent;
    box-shadow: none;
    cursor: zoom-in;
  }
  :host([type='button']:hover) {
    background-color: var(--uc-background-color-200);
  }

  uc-tooltip {
    font-size: inherit;
    border: 1px solid var(--uc-border-color-low);
    background-color: var(--uc-background-color-0);
    box-shadow: 0 1px 3px var(--uc-shadow-color-low);
    opacity: 1;
  }

  .gauge-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .gauge-container .title {
    font-size: 0.8em;
    line-height: 1.5;
    font-weight: 600;
    color: var(--uc-text-color-high);
  }

  .gauge-container svg {
    width: 10em;
    height: 5em;
  }

  .doughnut {
    transform: translate(165.305px, 165.305px);
  }
  .doughnut .first-arc path {
    fill: var(--uc-green-color-500);
  }
  .doughnut .second-arc path {
    stroke: none;
    fill: var(--uc-yellow-color-500);
  }
  .doughnut .third-arc path {
    stroke: none;
    fill: var(--uc-red-color-500);
  }

  .pointer {
    transform: translate(165.305px, 165.305px) rotate(-61deg);
  }
  .pointer path,
  .pointer circle {
    fill: var(--uc-background-color-1000);
  }

  .gauge-container .display {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-items: center;
    gap: 4px;
    padding: 8px;
  }
  .label {
    display: block;
    color: var(--uc-text-color-low);
    font-size: 0.8em;
  }
  .value {
    display: block;
    color: var(--uc-text-color-high);
    font-size: 1em;
    font-weight: 600;
  }
`;