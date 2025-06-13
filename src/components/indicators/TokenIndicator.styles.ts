import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    width: 160px;
    height: 80px;

    padding: 8px;
    border: 1px solid var(--uc-border-color-low);
    border-radius: 8px;
    background-color: var(--uc-background-color-0);
    box-shadow: 0 1px 3px var(--uc-shadow-color-low);

    --primary-color: var(--uc-green-color-500);
  }
  :host([status='normal']) {
    --primary-color: var(--uc-green-color-500);
  }
  :host([status='warning']) {
    --primary-color: var(--uc-yellow-color-500);
  }
  :host([status='critical']) {
    --primary-color: var(--uc-red-color-500);
  }

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .title {
    width: 100%;
    font-size: 12px;
    line-height: 18px;
    font-weight: 600;
  }

  .values {
    width: 100%;
    font-size: 12px;
    line-height: 18px;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
  }
  .values .max-value {
    font-weight: 400;
    color: var(--uc-text-color-mid);
  }
  .values .current-value {
    font-weight: 400;
    color: var(--primary-color);
  }

  .gauge {
    width: 100%;
    height: 10px;
    border: 1px solid var(--uc-border-color-low);
    border-radius: 4px;
    background-color: var(--uc-background-color-200);
  }
  .gauge .gauge-bar {
    width: 100%;
    height: 100%;
    background-color: var(--primary-color);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;