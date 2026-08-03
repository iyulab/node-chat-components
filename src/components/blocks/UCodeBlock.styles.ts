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
  /* ★다크 팔레트는 light-dark() 로 싣는다 — 종전에는 :host-context([theme="dark"]) 였고,
     그 선택자는 **Firefox·Safari 에서 미지원**이라 두 브라우저에서 다크 구문 강조가 적용된
     적이 없다(라이트용 색이 어두운 코드블록 위에 그대로 남았다).

     왜 light-dark() 인가: 테마 표시(theme 속성)는 문서 루트에 있고 이 팔레트는 섀도 루트
     안에 있다. 그 경계를 넘는 수단 중 상속되는 것은 color-scheme 뿐이고, 토큰 시트가
     :root[theme="dark"] { color-scheme: dark } 로 이미 선언한다 — 상속 프로퍼티라
     섀도 안까지 닿는다.

     ⚠**:host 에 color-scheme 을 선언하지 말 것.** 선언하면 루트에서 상속받은 값을 덮어
     OS 선호를 따르게 되어, 앱이 라이트인데 OS 가 다크면 코드블록만 어두워진다.

     ⚠**이 방식을 --u-* 디자인 토큰으로 확대하지 말 것.** getComputedStyle 로 읽는 소비자
     (같은 패키지의 UChartBlock 이 Chart.js 기본값을 그렇게 세팅한다)에게는 해석된 색이
     아니라 light-dark(...) **문자열 그대로** 돌아온다. 여기 팔레트는 CSS 안에서만 쓰이므로
     안전하다. */
  @supports (color: light-dark(#000, #fff)) {
    :host {
      --hljs-text-color: light-dark(#24292e, #c9d1d9);
      --hljs-background-color: light-dark(#ffffff, #0d1117);
      --hljs-keyword-color: light-dark(#d73a49, #ff7b72);
      --hljs-entity-color: light-dark(#6f42c1, #d2a8ff);
      --hljs-constant-color: light-dark(#005cc5, #79c0ff);
      --hljs-string-color: light-dark(#032f62, #a5d6ff);
      --hljs-variable-color: light-dark(#e36209, #ffa657);
      --hljs-comment-color: light-dark(#6a737d, #8b949e);
      --hljs-entity-tag-color: light-dark(#22863a, #7ee787);
      --hljs-markup-heading-color: light-dark(#005cc5, #1f6feb);
      --hljs-markup-list-color: light-dark(#735c0f, #f2cc60);
      --hljs-addition-color: light-dark(#22863a, #aff5b4);
      --hljs-addition-bg-color: light-dark(#f0fff4, #033a16);
      --hljs-deletion-color: light-dark(#b31d28, #ffdcd7);
      --hljs-deletion-bg-color: light-dark(#ffeef0, #67060c);
    }
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
    gap: 12px;
    margin-bottom: 12px;
    user-select: none;
  }
  .header .status {
    display: inline-flex;
    font-size: 12px;
    color: var(--u-txt-color-strong);
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