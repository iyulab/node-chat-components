import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    width: 160px;
    height: 80px;

    padding: 8px;
    border-radius: 8px;
    border: 1px solid var(--uc-border-color-low);
    background-color: var(--uc-background-color-0);
    box-shadow: 0 1px 3px var(--uc-shadow-color-low);
    box-sizing: border-box;
  }

  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 6px;
  }

  .title {
    font-size: 12px;
    font-weight: 600;
    line-height: 1.5;
  }

  .counters {
    font-size: 12px;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    width: 100%;

    .usage-count {
      font-weight: 600;
      color: var(--uc-blue-color-600);
    }

    .max-count {
      font-weight: 300;
      color: var(--uc-text-color-mid);
    }
  }

  .gauge {
    width: 100%;
    height: 8px;
    border-radius: 4px;
    border: 1px solid var(--uc-border-color-low);
    background-color: var(--uc-background-color-300);
    box-sizing: border-box;
    overflow: hidden;

    .gauge-bar {
      width: 100%;
      height: 100%;
      background-color: var(--uc-success-color);
      transform-origin: left;
      transform: scaleX(0);
      transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .gauge-bar.warning {
      background-color: var(--uc-warning-color);
    }
    .gauge-bar.critical {
      background-color: var(--uc-danger-color);
    }
  }
`;