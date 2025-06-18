import { css } from "lit";

export const styles = css`
  :host {
    display: inline-flex;
    font-size: 32px;
    color: inherit;
  }

  .container {
    position: relative;
    width: 1em;
    height: 1em;
    animation: rotate_action 2s infinite;
  }

  .container svg {
    position: absolute;
    top: 0;
    left: 0;
    fill: currentColor;
  }

  /* 위 모래 (첫 번째 SVG) */
  .top {
    opacity: 1;
    animation: top_action 2s infinite;
  }

  /* 흘러내리는 모래 (두 번째 SVG) */
  .flow {
    opacity: 0;
    animation: flow_action 2s infinite;
  }

  /* 아래 모래 (세 번째 SVG) */
  .bottom {
    opacity: 0;
    animation: bottom_action 2s infinite;
  }

  @keyframes rotate_action {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(180deg); }
    50% { transform: rotate(180deg); }
    75% { transform: rotate(360deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes top_action {
    0% { opacity: 0; }
    24% { opacity: 0; }
    25% { opacity: 0; }
    49% { opacity: 0; }
    50% { opacity: 1; }
    74% { opacity: 1; }
    75% { opacity: 0; }
    100% { opacity: 0; }
  }

  @keyframes bottom_action {
    0% { opacity: 1; }
    24% { opacity: 1; }
    25% { opacity: 0; }
    49% { opacity: 0; }
    50% { opacity: 0; }
    74% { opacity: 0; }
    75% { opacity: 1; }
    100% { opacity: 1; }
  }

  @keyframes flow_action {
    0% { opacity: 0; }
    24% { opacity: 0; }
    25% { opacity: 1; }
    49% { opacity: 1; }
    50% { opacity: 0; }
    74% { opacity: 0; }
    75% { opacity: 1; }
    99% { opacity: 1; }
    100% { opacity: 0; }
  }
`;