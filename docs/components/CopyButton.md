# CopyButton Component

`<u-copy-button>` - 클립보드 복사 버튼 컴포넌트

## Overview

CopyButton은 클릭 시 지정된 텍스트를 클립보드에 복사하는 버튼 컴포넌트입니다. 복사 성공 시 시각적 피드백을 제공합니다.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `undefined` | 복사할 텍스트 |
| `mode` | `'badge' \| 'symbol'` | `'symbol'` | 표시 모드 |
| `isCopied` | `boolean` | `false` | 복사 완료 상태 (읽기 전용) |
| `delay` | `number` | `1000` | 복사 후 리셋 지연 시간 (ms) |

## Modes

| Mode | Description | Visual |
|------|-------------|--------|
| `symbol` | 아이콘만 표시 + 툴팁 | 📋 (hover: "Copy") |
| `badge` | 아이콘 + 텍스트 라벨 | 📋 Copy |

## Usage

### Symbol Mode (Default)

```html
<u-copy-button
  .value=${"Text to copy"}
></u-copy-button>
```

### Badge Mode

```html
<u-copy-button
  mode="badge"
  .value=${"Text to copy"}
></u-copy-button>
```

### Custom Delay

```html
<u-copy-button
  .value=${"Text to copy"}
  delay=${2000}
></u-copy-button>
```

### React Integration

```tsx
import { useRef, useEffect } from 'react';

interface UCopyButtonElement extends HTMLElement {
  value: string;
  mode?: 'badge' | 'symbol';
  delay?: number;
}

function CopyButton({
  text,
  mode = 'symbol'
}: {
  text: string;
  mode?: 'badge' | 'symbol';
}) {
  const ref = useRef<UCopyButtonElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.value = text;
    }
  }, [text]);

  return <u-copy-button ref={ref} mode={mode} />;
}
```

### In Code Block

CodeBlock 컴포넌트 내에서 자동으로 CopyButton이 포함됩니다:

```html
<u-code-block language="javascript" .value=${code}>
  <!-- Copy button is automatically included in header -->
</u-code-block>
```

### In Message

Message 컴포넌트의 footer에도 자동으로 CopyButton이 포함됩니다:

```html
<u-message .items=${items}>
  <!-- Copy button is automatically included in footer -->
</u-message>
```

## Clipboard API Fallback

CopyButton은 브라우저 Clipboard API가 지원되지 않는 경우 document.execCommand('copy') 폴백을 사용합니다.

## Styling

```css
u-copy-button {
  --copy-button-color: var(--color-text-secondary);
  cursor: pointer;
}

u-copy-button:hover {
  --copy-button-color: var(--color-primary);
}

u-copy-button[isCopied] {
  --copy-button-color: var(--color-success);
}

/* Badge mode specific */
u-copy-button[mode="badge"] {
  --copy-button-padding: 0.25rem 0.5rem;
  --copy-button-bg: var(--surface-subtle);
  --copy-button-border-radius: 0.25rem;
}
```
