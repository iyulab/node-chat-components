import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    width: 100%;
    border: 1px solid var(--uc-border-color-mid);
    border-radius: 8px;
    background-color: var(--uc-background-color-100);
    padding: 8px 16px;
    margin-bottom: 1rem;
  }

  .header {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13.6px;
    font-weight: 300;
    color: var(--uc-text-color-mid);
    margin-bottom: 12px;
    user-select: none;
  }

  /* highlight.js styles */
  .hljs {
    display: block;
    overflow-x: auto;
    margin: 0;
    padding: 0;
    color: var(--hljs-text-color);
    font-family: var(--fontStack-monospace, ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace);
    font-size: 13.6px;
    line-height: 1.45;
    white-space: pre;
    scrollbar-gutter: stable;
  }

  .hljs-doctag,
  .hljs-keyword,
  .hljs-meta .hljs-keyword,
  .hljs-template-tag,
  .hljs-template-variable,
  .hljs-type,
  .hljs-variable.language_ {
    color: var(--hljs-keyword-color);
  }

  .hljs-title,
  .hljs-title.class_,
  .hljs-title.class_.inherited__,
  .hljs-title.function_ {
    color: var(--hljs-entity-color);
  }

  .hljs-attr,
  .hljs-attribute,
  .hljs-literal,
  .hljs-meta,
  .hljs-number,
  .hljs-operator,
  .hljs-variable,
  .hljs-selector-attr,
  .hljs-selector-class,
  .hljs-selector-id {
    color: var(--hljs-constant-color);
  }

  .hljs-regexp,
  .hljs-string,
  .hljs-meta .hljs-string {
    color: var(--hljs-string-color);
  }

  .hljs-built_in,
  .hljs-symbol {
    color: var(--hljs-variable-color);
  }

  .hljs-comment,
  .hljs-code,
  .hljs-formula {
    color: var(--hljs-comment-color);
  }

  .hljs-name,
  .hljs-quote,
  .hljs-selector-tag,
  .hljs-selector-pseudo {
    color: var(--hljs-entity-tag-color);
  }

  .hljs-subst {
    color: var(--hljs-text-color);
  }

  .hljs-section {
    color: var(--hljs-markup-heading-color);
    font-weight: bold;
  }

  .hljs-bullet {
    color: var(--hljs-markup-list-color);
  }

  .hljs-emphasis {
    color: var(--hljs-text-color);
    font-style: italic;
  }

  .hljs-strong {
    color: var(--hljs-text-color);
    font-weight: bold;
  }

  .hljs-addition {
    color: var(--hljs-addition-color);
    background-color: var(--hljs-addition-bg-color);
  }

  .hljs-deletion {
    color: var(--hljs-deletion-color);
    background-color: var(--hljs-deletion-bg-color);
  }

  .hljs-char.escape_,
  .hljs-link,
  .hljs-params,
  .hljs-property,
  .hljs-punctuation,
  .hljs-tag {
    color: currentColor;
  }
`;