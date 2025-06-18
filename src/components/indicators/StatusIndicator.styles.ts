import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    font-size: 16px;
    padding: 8px;
    border: 1px solid var(--uc-border-color-low);
    border-radius: 8px;
    background-color: var(--uc-background-color-0);
    box-shadow: 0 1px 3px var(--uc-shadow-color-low);
  }
  
  .container {
    width: 10em;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .title {
    font-size: 0.8em;
    line-height: 1.5;
    font-weight: 600;
  }

  .loader {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .loader > * {
    font-size: 3em;
  }
`;