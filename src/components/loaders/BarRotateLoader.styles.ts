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

  .bars {
    transform-origin:center;
    animation:rotate_action .75s step-end infinite
  }
  
  @keyframes rotate_action {
    8.3%{transform:rotate(30deg)}
    16.6%{transform:rotate(60deg)}
    25%{transform:rotate(90deg)}
    33.3%{transform:rotate(120deg)}
    41.6%{transform:rotate(150deg)}
    50%{transform:rotate(180deg)}
    58.3%{transform:rotate(210deg)}
    66.6%{transform:rotate(240deg)}
    75%{transform:rotate(270deg)}
    83.3%{transform:rotate(300deg)}
    91.6%{transform:rotate(330deg)}
    100%{transform:rotate(360deg)}
  }
`;