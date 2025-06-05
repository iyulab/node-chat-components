import { css } from "lit";

export const styles = css`
  :host {
    display: inline-flex;
    font-size: 32px;
    color: inherit;
  }

  svg {
    width: 1em;
    height: 1em;
    fill: currentColor;
  }

  .pulser {
    animation: pulse 2s cubic-bezier(0.52,.6,.25,.99) infinite;
  }
    
  @keyframes pulse {
    0% {
      r: 0;
      opacity: 1;
    }
    100% {
      r: 12px;
      opacity: 0;
    }
  }
`;