import { css } from "lit";

export const styles = css`
  :host {
    --hljs-text-color: #24292e;
    --hljs-background-color: #ffffff;
    --hljs-keyword-color: #d73a49;
    --hljs-entity-color: #6f42c1;
    --hljs-constant-color: #005cc5;
    --hljs-string-color: #032f62;
    --hljs-variable-color: #e36209;
    --hljs-comment-color: #6a737d;
    --hljs-entity-tag-color: #22863a;
    --hljs-markup-heading-color: #005cc5;
    --hljs-markup-list-color: #735c0f;
    --hljs-addition-color: #22863a;
    --hljs-addition-bg-color: #f0fff4;
    --hljs-deletion-color: #b31d28;
    --hljs-deletion-bg-color: #ffeef0;
  }
  :host-context([theme="dark"]) {
    --hljs-text-color: #c9d1d9;
    --hljs-background-color: #0d1117;
    --hljs-keyword-color: #ff7b72;
    --hljs-entity-color: #d2a8ff;
    --hljs-constant-color: #79c0ff;
    --hljs-string-color: #a5d6ff;
    --hljs-variable-color: #ffa657;
    --hljs-comment-color: #8b949e;
    --hljs-entity-tag-color: #7ee787;
    --hljs-markup-heading-color: #1f6feb;
    --hljs-markup-list-color: #f2cc60;
    --hljs-addition-color: #aff5b4;
    --hljs-addition-bg-color: #033a16;
    --hljs-deletion-color: #ffdcd7;
    --hljs-deletion-bg-color: #67060c;
  }

  :host {
    display: block;
    width: 100%;
    padding: 8px 16px;
    border: 1px solid var(--u-border-color);
    border-radius: 8px;
    background-color: var(--u-neutral-100);
  }

  .header {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    user-select: none;
  }
  .header .lang {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 12px;
    font-weight: 300;
    color: var(--u-txt-color-strong);
  }

  /* highlight.js styles */
  .hljs {
    display: block;
    margin: 0;
    padding: 0;
    color: var(--hljs-text-color);
    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
    font-size: 14px;
    line-height: 1.45;
    white-space: pre;
    overflow: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--u-scrollbar-color) transparent;
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