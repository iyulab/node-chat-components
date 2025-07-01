import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    font-family: inherit;
    font-size: inherit;
    line-height: 1.5;

    --json-property-color: #0451a5;
    --json-string-color: #a31515;
    --json-number-color: #098658;
    --json-boolean-color: #0000ff;
    --json-null-color: #0000ff;
    --json-preview-color: #999999;
    --json-arrow-color: #666968;
    --json-guide-color: #c0c0c0;

    --indent-size: 2em;
  }
  :host-context([theme="dark"]) {
    --json-property-color: #9cdcfe;
    --json-string-color: #ce9178;
    --json-number-color: #b5cea8;
    --json-boolean-color: #569cd6;
    --json-null-color: #569CD6;
    --json-preview-color: #999999;
    --json-arrow-color: #d4d4d4;
    --json-guide-color: #3c3c3c;
  }

  .key {
    color: var(--json-property-color);
    display: inline-flex;
    align-items: center;
  }
  .key[collapsable] {
    cursor: pointer;
    user-select: none;
  }
  .key[collapsable]::before {
    display: inline-flex;
    font-size: 0.5em;
    content: '▶';
    align-items: center;
    justify-content: center;

    transform: rotate(90deg);
    transition: transform 0.2s ease-out;
    margin-right: 0.5em;

    color: var(--json-arrow-color);
  }
  .key[collapsable][collapsed]::before {
    transform: rotate(0);
  }

  .preview {
    color: var(--json-preview-color);
    margin-left: 0.5em;
  }

  .string {
    color: var(--json-string-color);
  }

  .number {
    color: var(--json-number-color);
  }

  .boolean {
    color: var(--json-boolean-color);
  }

  .null {
    color: var(--json-null-color);
  }

  /* object styles */
  ul {
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
    clear: both;
  }

  /* property styles */
  li {
    position: relative;
    list-style: none;
    outline: none;
  }

  /* nested property styles */
  li ul > li {
    position: relative;
    margin-left: var(--indent-size);
    padding-left: 0px;
  }

  /* guide line styles */
  ul ul::before {
    content: '';
    border-left: 1px solid var(--json-guide-color);
    position: absolute;
    left: calc(1.5em / 2 - 1px);
    top: 0.2em;
    bottom: 0.2em;
  }
`;
