import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    border: 1px solid var(--uc-border-color-low);
    border-radius: 4px;
    box-shadow: 0 2px 10px var(--uc-shadow-color-mid);
    background-color: var(--uc-background-color-0);
    opacity: 0;
    pointer-events: none;
    transform: translateY(32px);
    transition: opacity 0.3s ease, transform 0.3s ease;

    --min-rows: 3;
    --max-rows: 10;
  }
  :host([open]) {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }
  :host([status="info"]) {
    --primary-color: var(--uc-blue-color-500);
  }
  :host([status="success"]) {
    --primary-color: var(--uc-green-color-500);
  }
  :host([status="warning"]) {
    --primary-color: var(--uc-yellow-color-500);
  }
  :host([status="danger"]) {
    --primary-color: var(--uc-red-color-500);
  }

  .container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .progress {
    display: block;
    height: 3px;
  }
  .progress .progress-bar {
    height: 100%;
    transform-origin: left;
    background-color: var(--primary-color);
  }

  .header {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px 0px 12px;
    gap: 12px;
    user-select: none;
  }
  .header .icon {
    font-size: 16px;
    color: var(--primary-color);
  }
  .header .title {
    font-size: 14px;
    font-weight: 600;
    line-height: 16px;
  }
  .header .flex {
    flex: 1;
  }
  .header .close-btn {
    font-size: 16px;
    color: var(--primary-color);
    cursor: pointer;
    justify-self: flex-end;
  }
  .header .close-btn:hover {
    opacity: 0.7;
  }

  .body {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.5;
    padding: 4px 12px;
    overflow-y: auto;
    max-height: calc(1.5em * var(--max-rows) + 8px);
    transition: max-height 0.3s ease;
  }
  .body[collapsed] {
    overflow: hidden;
    max-height: calc(1.5em * var(--min-rows) + 8px);
  }

  .footer {
    display: block;
  }
  .footer .more-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    cursor: pointer;
    transform: translateY(0);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .footer .more-btn[hidden] {
    display: none;
  }
  .footer .more-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 4px var(--uc-shadow-color-high);
  }
  .footer .more-btn:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px var(--uc-shadow-color-high);
  }
`;
