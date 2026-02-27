import { css } from "lit";

export const styles = css`
  :host {
    position: relative;
    display: block;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    margin: 0.75em 0;
  }

  iframe {
    width: 100%;
    height: 300px;
    display: block;
    border: none;
  }

  .caption {
    text-decoration: none;
    max-width: 60%;
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    flex-direction: column;
    gap: 0.25em;
    padding: 0.25em 0.5em;
    color: #fff;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 6px;
    backdrop-filter: blur(4px);
  }
  .caption:hover {
    background: rgba(0, 0, 0, 0.8);
  }
  .caption strong {
    font-size: 0.8em;
  }
  .caption span {
    font-size: 0.7em;
    opacity: 0.8;
  }
`;
