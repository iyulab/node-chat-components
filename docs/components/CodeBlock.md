# CodeBlock Component

`<u-code-block>` - 코드 하이라이팅 컴포넌트

## Overview

CodeBlock은 코드를 syntax highlighting과 함께 표시하는 컴포넌트입니다. highlight.js를 사용하여 다양한 언어를 지원합니다.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `undefined` | 코드 내용 |
| `language` | `string` | `'plaintext'` | 코드 언어 |
| `headless` | `boolean` | `false` | 헤더 숨김 여부 |

## Features

- **Syntax Highlighting**: highlight.js 기반 190+ 언어 지원
- **Language Detection**: 지원하지 않는 언어는 자동으로 'plaintext'로 폴백
- **Copy Button**: 코드 복사 버튼 내장
- **Headless Mode**: 헤더 없이 코드만 표시 가능

## Supported Languages

highlight.js가 지원하는 모든 언어를 사용할 수 있습니다. 주요 언어:

- `javascript`, `typescript`, `jsx`, `tsx`
- `python`, `java`, `csharp`, `go`, `rust`
- `html`, `css`, `scss`, `json`, `xml`
- `bash`, `shell`, `powershell`
- `sql`, `graphql`
- `markdown`, `yaml`, `toml`

## Usage

### Basic Usage

```html
<u-code-block
  language="javascript"
  .value=${"const greeting = 'Hello, World!';\nconsole.log(greeting);"}
></u-code-block>
```

### Headless Mode

```html
<u-code-block
  headless
  language="json"
  .value=${'{"key": "value"}'}
></u-code-block>
```

### In Markdown

MarkdownBlock 내에서 코드 펜스를 사용하면 자동으로 CodeBlock으로 변환됩니다:

```markdown
\`\`\`python
def hello():
    print("Hello!")
\`\`\`
```

### React Integration

```tsx
import { useRef, useEffect } from 'react';

interface UCodeBlockElement extends HTMLElement {
  value: string;
  language: string;
  headless?: boolean;
}

function CodeDisplay({ code, language }: { code: string; language: string }) {
  const ref = useRef<UCodeBlockElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.value = code;
      ref.current.language = language;
    }
  }, [code, language]);

  return <u-code-block ref={ref}></u-code-block>;
}
```

## Styling

```css
u-code-block {
  --code-block-border-radius: 0.5rem;
  --code-block-header-bg: var(--surface-subtle);
  --code-block-body-bg: var(--surface-code);
}

/* highlight.js 테마 커스터마이징 */
u-code-block .hljs {
  background: var(--surface-code);
  color: var(--text-code);
}

u-code-block .hljs-keyword {
  color: var(--syntax-keyword);
}

u-code-block .hljs-string {
  color: var(--syntax-string);
}
```

## Theme Integration

highlight.js 테마를 사용하려면:

```javascript
// 기본 테마 사용
import 'highlight.js/styles/github.css';

// 또는 다크 테마
import 'highlight.js/styles/github-dark.css';
```
