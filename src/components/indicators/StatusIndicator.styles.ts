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
  }
  
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .title {
    font-size: 12px;
    line-height: 18px;
    font-weight: 600;
  }

  .loader {
    width: 100%;
    height: calc(100% - 18px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .loader > * {
    font-size: 40px;
  }
`;