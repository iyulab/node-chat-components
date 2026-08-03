import { css } from "lit";

export const styles = css`
  /* github-markdown styles */
  :host {
    --fontStack-monospace: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
    --base-size-4: 0.25rem;
    --base-size-8: 0.5rem;
    --base-size-16: 1rem;
    --base-size-24: 1.5rem;
    --base-size-40: 2.5rem;
    --base-text-weight-normal: 400;
    --base-text-weight-medium: 500;
    --base-text-weight-semibold: 600;

    --focus-outlineColor: #0969da;
    --fgColor-default: #1f2328;
    --fgColor-muted: #59636e;
    --fgColor-accent: #0969da;
    --bgColor-default: #ffffff;
    --bgColor-muted: #f6f8fa;
    --bgColor-neutral-muted: #818b981f;
    --bgColor-attention-muted: #fff8c5;
    --borderColor-default: #d1d9e0;
    --borderColor-muted: #d1d9e0b3;
    --borderColor-neutral-muted: #d1d9e0b3;
  }
  /* ★다크 팔레트는 light-dark() 로 — 근거는 UCodeBlock.styles.ts 의 같은 자리 주석 참조.
     :host-context() 가 Firefox·Safari 미지원이라 두 브라우저에서 마크다운 본문의 다크가
     적용된 적이 없다. */
  @supports (color: light-dark(#000, #fff)) {
    :host {
      --focus-outlineColor: light-dark(#0969da, #1f6feb);
      --fgColor-default: light-dark(#1f2328, #f0f6fc);
      --fgColor-muted: light-dark(#59636e, #9198a1);
      --fgColor-accent: light-dark(#0969da, #4493f8);
      --bgColor-default: light-dark(#ffffff, #0d1117);
      --bgColor-muted: light-dark(#f6f8fa, #151b23);
      --bgColor-neutral-muted: light-dark(#818b981f, #656c7633);
      --bgColor-attention-muted: light-dark(#fff8c5, #bb800926);
      --borderColor-default: light-dark(#d1d9e0, #3d444d);
      --borderColor-muted: light-dark(#d1d9e0b3, #3d444db3);
      --borderColor-neutral-muted: light-dark(#d1d9e0b3, #3d444db3);
    }
  }

  :host {
    display: block;
    width: 100%;
    height: auto;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    margin: 0;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
    font-size: 16px;
    line-height: 1.5;
    word-wrap: break-word;
  }

  /* Custom Block Start */
  u-code-block {
    margin-bottom: var(--base-size-16);
  }

  .katex math {
    margin: var(--base-size-16) 0;
  }

  u-tooltip {
    padding: 0;
    border: none;
    box-shadow: none;
    background-color: transparent;
  }
  u-tooltip[visible] {
    opacity: 1;
  }
  /* Custom Block End */

  a {
    background-color: transparent;
    color: var(--fgColor-accent);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  a:focus,
  input[type=checkbox]:focus {
    outline: 2px solid var(--focus-outlineColor);
    outline-offset: -2px;
    box-shadow: none;
  }

  a:focus:not(:focus-visible),
  input[type=checkbox]:focus:not(:focus-visible) {
    outline: solid 1px transparent;
  }

  a:focus-visible,
  input[type=checkbox]:focus-visible {
    outline: 2px solid var(--focus-outlineColor);
    outline-offset: -2px;
    box-shadow: none;
  }

  a:not([class]):focus,
  a:not([class]):focus-visible,
  input[type=checkbox]:focus,
  input[type=checkbox]:focus-visible {
    outline-offset: 0;
  }

  a:not([href]) {
    color: inherit;
    text-decoration: none;
  }

  b,
  strong {
    font-weight: var(--base-text-weight-semibold, 600);
  }

  em {
    font-style: italic;
  }

  del {
    text-decoration: line-through;
  }

  h1 {
    margin: .67em 0;
    font-weight: var(--base-text-weight-semibold, 600);
    padding-bottom: .3em;
    font-size: 2em;
    border-bottom: 1px solid var(--borderColor-muted);
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: var(--base-size-24);
    margin-bottom: var(--base-size-16);
    font-weight: var(--base-text-weight-semibold, 600);
    line-height: 1.25;
  }

  h2 {
    font-weight: var(--base-text-weight-semibold, 600);
    padding-bottom: .3em;
    font-size: 1.5em;
    border-bottom: 1px solid var(--borderColor-muted);
  }

  h3 {
    font-weight: var(--base-text-weight-semibold, 600);
    font-size: 1.25em;
  }

  h4 {
    font-weight: var(--base-text-weight-semibold, 600);
    font-size: 1em;
  }

  h5 {
    font-weight: var(--base-text-weight-semibold, 600);
    font-size: .875em;
  }

  h6 {
    font-weight: var(--base-text-weight-semibold, 600);
    font-size: .85em;
    color: var(--fgColor-muted);
  }

  h1 tt,
  h1 code,
  h2 tt,
  h2 code,
  h3 tt,
  h3 code,
  h4 tt,
  h4 code,
  h5 tt,
  h5 code,
  h6 tt,
  h6 code {
    padding: 0 .2em;
    font-size: inherit;
  }

  p {
    margin-top: 0;
    margin-bottom: 10px;
  }

  blockquote {
    margin: 0;
    padding: 0 1em;
    color: var(--fgColor-muted);
    border-left: .25em solid var(--borderColor-default);
  }

  blockquote>:first-child {
    margin-top: 0;
  }

  blockquote>:last-child {
    margin-bottom: 0;
  }

  ul,
  ol {
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 2em;
  }

  ul ul,
  ul ol,
  ol ol,
  ol ul {
    margin-top: 0;
    margin-bottom: 0;
  }

  ol ol,
  ul ol {
    list-style-type: lower-roman;
  }

  ul ul ol,
  ul ol ol,
  ol ul ol,
  ol ol ol {
    list-style-type: lower-alpha;
  }

  ol[type="a s"] {
    list-style-type: lower-alpha;
  }

  ol[type="A s"] {
    list-style-type: upper-alpha;
  }

  ol[type="i s"] {
    list-style-type: lower-roman;
  }

  ol[type="I s"] {
    list-style-type: upper-roman;
  }

  ol[type="1"] {
    list-style-type: decimal;
  }

  div>ol:not([type]) {
    list-style-type: decimal;
  }

  li>p {
    margin-top: var(--base-size-16);
  }

  li+li {
    margin-top: .25em;
  }

  dl {
    padding: 0;
  }

  dl dt {
    padding: 0;
    margin-top: var(--base-size-16);
    font-size: 1em;
    font-style: italic;
    font-weight: var(--base-text-weight-semibold, 600);
  }

  dl dd {
    padding: 0 var(--base-size-16);
    margin-bottom: var(--base-size-16);
  }

  dd {
    margin-left: 0;
  }

  mark {
    background-color: var(--bgColor-attention-muted);
    color: var(--fgColor-default);
  }

  small {
    font-size: 90%;
  }

  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  sub {
    bottom: -0.25em;
  }

  sup {
    top: -0.5em;
  }

  img {
    border-style: none;
    max-width: 100%;
    box-sizing: content-box;
    background-color: transparent;
  }

  .emoji {
    max-width: none;
    vertical-align: text-top;
    background-color: transparent;
  }

  code,
  kbd,
  pre,
  samp,
  tt {
    font-family: var(--fontStack-monospace);
    font-size: 1em;
  }

  tt,
  code,
  samp {
    font-size: 12px;
  }

  code,
  tt {
    padding: .2em .4em;
    margin: 0;
    font-size: 85%;
    font-weight: 600;
    white-space: break-spaces;
    background-color: var(--bgColor-neutral-muted);
    border-radius: 6px;
  }

  code br,
  tt br {
    display: none;
  }

  del code {
    text-decoration: inherit;
  }

  samp {
    font-size: 85%;
  }

  pre {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 12px;
    word-wrap: normal;
  }

  pre code {
    font-size: 100%;
  }

  pre>code {
    padding: 0;
    margin: 0;
    word-break: normal;
    white-space: pre;
    background: transparent;
    border: 0;
  }

  .highlight {
    margin-bottom: var(--base-size-16);
  }

  .highlight pre {
    margin-bottom: 0;
    word-break: normal;
  }

  .highlight pre,
  pre {
    padding: var(--base-size-16);
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    color: var(--fgColor-default);
    background-color: var(--bgColor-muted);
    border-radius: 6px;
  }

  pre code,
  pre tt {
    display: inline;
    max-width: auto;
    padding: 0;
    margin: 0;
    overflow: visible;
    line-height: inherit;
    word-wrap: normal;
    background-color: transparent;
    border: 0;
  }

  kbd {
    display: inline-block;
    padding: var(--base-size-4);
    font: 11px var(--fontStack-monospace);
    line-height: 10px;
    color: var(--fgColor-default);
    vertical-align: middle;
    background-color: var(--bgColor-muted);
    border: solid 1px var(--borderColor-neutral-muted);
    border-bottom-color: var(--borderColor-neutral-muted);
    border-radius: 6px;
    box-shadow: inset 0 -1px 0 var(--borderColor-neutral-muted);
  }

  hr {
    box-sizing: content-box;
    overflow: hidden;
    background: transparent;
    border-bottom: 1px solid var(--borderColor-muted);
    height: .25em;
    padding: 0;
    margin: var(--base-size-24) 0;
    background-color: var(--borderColor-default);
    border: 0;
  }

  hr::before {
    display: table;
    content: "";
  }

  hr::after {
    display: table;
    clear: both;
    content: "";
  }

  table {
    border-spacing: 0;
    border-collapse: collapse;
    display: block;
    width: max-content;
    max-width: 100%;
    overflow: auto;
    font-variant: tabular-nums;
  }

  table th {
    font-weight: var(--base-text-weight-semibold, 600);
  }

  table th,
  table td {
    padding: 6px 13px;
    border: 1px solid var(--borderColor-default);
  }

  table td>:last-child {
    margin-bottom: 0;
  }

  table tr {
    background-color: var(--bgColor-default);
    border-top: 1px solid var(--borderColor-muted);
  }

  table tr:nth-child(2n) {
    background-color: var(--bgColor-muted);
  }

  table img {
    background-color: transparent;
  }

  td,
  th {
    padding: 0;
  }

  input {
    font: inherit;
    margin: 0;
    overflow: visible;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  [type=checkbox] {
    box-sizing: border-box;
    padding: 0;
  }

  ::placeholder {
    color: var(--fgColor-muted);
    opacity: 1;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    margin: 0;
    appearance: none;
  }

  .markdown-body::before {
    display: table;
    content: "";
  }

  .markdown-body::after {
    display: table;
    clear: both;
    content: "";
  }

  .markdown-body>*:first-child {
    margin-top: 0 !important;
  }

  .markdown-body>*:last-child {
    margin-bottom: 0 !important;
  }

  p,
  blockquote,
  ul,
  ol,
  dl,
  table,
  pre {
    margin-top: 0;
    margin-bottom: var(--base-size-16);
  }

  .task-list-item {
    list-style-type: none;
  }

  .task-list-item+.task-list-item {
    margin-top: var(--base-size-4);
  }

  .task-list-item-checkbox {
    margin: 0 .2em .25em -1.4em;
    vertical-align: middle;
  }

  ul:dir(rtl) .task-list-item-checkbox {
    margin: 0 -1.6em .25em .2em;
  }

  ol:dir(rtl) .task-list-item-checkbox {
    margin: 0 -1.6em .25em .2em;
  }
`;
