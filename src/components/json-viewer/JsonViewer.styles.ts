import { css } from 'lit';

export const styles = css`
  :where(:host) {
    /* --background-color: #f5f5f5; */
    --color: #333333;
    --string-color: #e03131;
    --number-color: #12b886;
    --boolean-color: #5f3dc4;
    --null-color: #808080;
    --property-color: #228be6;
    --preview-color: #bd5f1b;
    --highlight-color: #ff0000;

    --indent-size: 0.5em;
    --indentguide: 1px solid #ccc;
  }

  :host {
    display: block;
    color: var(--color);
    font-family: inherit;
    font-size: inherit;
    line-height: 1.5;
  }

  :focus {
    outline-color: #666968;
    outline-width: 1px;
    outline-style: dotted;
  }

  .preview {
    color: var(--preview-color);
  }

  .null {
    color: var(--null-color);
  }

  .key {
    color: var(--property-color);
    display: inline-flex;
    align-items: flex-start;
  }

  .collapsable::before {
    display: inline-flex;
    font-size: 0.8em;
    content: '▶';
    width: 1.5em;
    height: 1.5em;
    align-items: center;
    justify-content: center;

    transition: transform 195ms ease-out;
    transform: rotate(90deg);

    color: inherit;
  }

  .collapsable--collapsed::before {
    transform: rotate(0);
  }

  .collapsable {
    cursor: pointer;
    user-select: none;
  }

  .string {
    color: var(--string-color);
  }

  .number {
    color: var(--number-color);
  }

  .boolean {
    color: var(--boolean-color);
  }

  ul {
    margin: 0;
    padding: 0;
    clear: both;
  }

  ul, li {
    position: relative;
    list-style: none;
  }

  li ul > li {
    position: relative;
    margin-left: calc(var(--indent-size) + 1.5em);
    padding-left: 0px;
  }

  ul ul::before {
    content: '';
    border-left: var(--indentguide);
    position: absolute;
    left: calc(1.5em / 2 - 1px);
    top: 0.2rem;
    bottom: 0.2rem;
  }

  mark {
    background-color: var(--highlight-color);
  }
`;
