# ThinkingBlock Component

`<u-thinking-block>` - AI 추론 과정 표시 컴포넌트

## Overview

ThinkingBlock은 AI 모델의 추론(Thinking) 과정을 표시하는 컴포넌트입니다. Claude의 Extended Thinking이나 다른 LLM의 Chain-of-Thought 내용을 표시할 때 사용합니다.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `undefined` | 추론 내용 |
| `loading` | `boolean` | `false` | 로딩 상태 (스트리밍 중) |
| `collapsed` | `boolean` | `true` | 접힘 상태 |

## Features

- **Collapsible**: 클릭으로 펼치기/접기 가능
- **Loading Animation**: 스트리밍 중일 때 "🤔 Thinking..." 애니메이션
- **Auto-scroll**: 로딩 중 새 내용이 추가되면 자동 스크롤
- **Visual States**: 로딩 중/완료 시 다른 아이콘 표시

## States

| State | Icon | Title |
|-------|------|-------|
| Loading | 🤔 | "Thinking" (with animation) |
| Completed | 💡 | "Thought" |

## Usage

### Basic Usage

```html
<u-thinking-block
  .value=${"Let me analyze this step by step..."}
></u-thinking-block>
```

### Loading State (Streaming)

```html
<u-thinking-block
  loading
  .value=${"Currently processing the request..."}
></u-thinking-block>
```

### Initially Expanded

```html
<u-thinking-block
  .collapsed=${false}
  .value=${"Detailed reasoning content..."}
></u-thinking-block>
```

### In Message Context

Message 컴포넌트 내에서 사용 시, 마지막 thinking 블록은 자동으로 `loading=true`로 설정됩니다:

```html
<u-message
  .items=${[
    { type: 'thinking', value: 'Analyzing...' },
    { type: 'markdown', value: 'Result here' }
  ]}
></u-message>
```

### React Integration

```tsx
import { useRef, useEffect } from 'react';

interface UThinkingBlockElement extends HTMLElement {
  value: string;
  loading?: boolean;
  collapsed?: boolean;
}

function ThinkingDisplay({ content, isStreaming }: { content: string; isStreaming: boolean }) {
  const ref = useRef<UThinkingBlockElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.value = content;
      ref.current.loading = isStreaming;
    }
  }, [content, isStreaming]);

  return <u-thinking-block ref={ref}></u-thinking-block>;
}
```

## Streaming Example

스트리밍 중 thinking 내용이 업데이트되는 예시:

```typescript
const thinkingBlock = document.querySelector('u-thinking-block');

// Start streaming
thinkingBlock.loading = true;
thinkingBlock.value = '';

// Update content as it streams
eventSource.onmessage = (event) => {
  thinkingBlock.value += event.data;
};

// Finish streaming
eventSource.onerror = () => {
  thinkingBlock.loading = false;
};
```

## Styling

```css
u-thinking-block {
  --thinking-header-bg: var(--surface-subtle);
  --thinking-body-bg: var(--surface-default);
  --thinking-border-radius: 0.5rem;
}
```
