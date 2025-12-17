# MarkdownBlock Component

`<u-markdown-block>` - 마크다운 렌더링 컴포넌트

## Overview

MarkdownBlock은 마크다운 콘텐츠를 HTML로 렌더링하는 컴포넌트입니다. GitHub Flavored Markdown(GFM)을 지원하며, 코드 하이라이팅, KaTeX 수식, Alert, Footnote 등 확장 기능을 포함합니다.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `undefined` | 마크다운 콘텐츠 |

## Features

### Markdown Extensions

- **GitHub Flavored Markdown (GFM)**: 테이블, 취소선, 자동 링크 등
- **Code Blocks**: `<u-code-block>`을 사용한 syntax highlighting
- **KaTeX**: 수학 수식 렌더링 (MathML 출력)
- **Alerts**: GitHub 스타일 alert 박스 (`> [!NOTE]`, `> [!WARNING]` 등)
- **Footnotes**: 각주 지원

### Supported Syntax

```markdown
# Headers
## Subheaders

**Bold** and *italic* text

- Unordered lists
1. Ordered lists

| Tables | Support |
|--------|---------|
| Yes    | Yes     |

\`inline code\`

\`\`\`javascript
// Code blocks with syntax highlighting
const hello = "world";
\`\`\`

> [!NOTE]
> This is a note alert

Math: $E = mc^2$

Footnote reference[^1]

[^1]: Footnote content
```

## Usage

### Basic Usage

```html
<u-markdown-block
  .value=${"# Hello World\n\nThis is **markdown** content."}
></u-markdown-block>
```

### With Code

```html
<u-markdown-block
  .value=${`
Here is some code:

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`
  `}
></u-markdown-block>
```

### React Integration

```tsx
import { useRef, useEffect } from 'react';

interface UMarkdownBlockElement extends HTMLElement {
  value: string;
}

function MarkdownMessage({ content }: { content: string }) {
  const ref = useRef<UMarkdownBlockElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.value = content;
    }
  }, [content]);

  return <u-markdown-block ref={ref}></u-markdown-block>;
}
```

## Code Block Integration

마크다운 내의 코드 블록은 자동으로 `<u-code-block>` 컴포넌트로 변환됩니다:

```markdown
\`\`\`javascript
const x = 1;
\`\`\`
```

→ 렌더링 결과:

```html
<u-code-block language="javascript" value="const x = 1;"></u-code-block>
```

## Styling

```css
u-markdown-block .markdown-body {
  /* 마크다운 본문 스타일 */
}

u-markdown-block .markdown-body h1 {
  /* 헤더 스타일 */
}

u-markdown-block .markdown-body pre {
  /* 코드 블록 스타일 */
}
```
