# Message Component

`<u-message>` - 메시지 컨테이너 컴포넌트

## Overview

Message 컴포넌트는 채팅 메시지를 렌더링하는 컨테이너입니다. `BlockItem` 배열을 받아 각 타입에 맞는 하위 컴포넌트를 자동으로 렌더링합니다.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `items` | `BlockItem[]` | `undefined` | 렌더링할 블록 아이템 배열 |
| `timestamp` | `string` | `undefined` | 메시지 타임스탬프 (ISO 8601) |

## Slots

| Slot | Description |
|------|-------------|
| `header` | 메시지 헤더 영역 |
| `footer` | 메시지 푸터 영역 (복사 버튼 옆) |

## Features

- **Auto Block Rendering**: `items` 배열의 각 아이템 타입에 따라 적절한 블록 컴포넌트 렌더링
- **Loading State**: `items`가 비어있으면 로딩 애니메이션 표시
- **Copy Button**: 텍스트/마크다운 내용을 클립보드에 복사하는 버튼 자동 포함
- **Timestamp**: 타임스탬프를 현지 시간으로 포맷하여 표시

## Usage

### Basic Usage

```html
<u-message
  .items=${[
    { type: 'markdown', value: '**Hello** World!' }
  ]}
  timestamp="2024-01-15T10:30:00Z"
></u-message>
```

### With Multiple Blocks

```html
<u-message
  .items=${[
    { type: 'thinking', value: 'Analyzing the request...' },
    { type: 'tool', status: 'success', name: 'search', input: '{"query":"test"}', output: '{"results":[]}' },
    { type: 'markdown', value: '검색 결과입니다.' }
  ]}
></u-message>
```

### With Custom Header/Footer

```html
<u-message .items=${items}>
  <div slot="header">
    <img src="avatar.png" alt="avatar" />
    <span>Assistant</span>
  </div>
  <div slot="footer">
    <button>Like</button>
    <button>Dislike</button>
  </div>
</u-message>
```

### React Integration

```tsx
import { useRef, useEffect } from 'react';
import type { BlockItem } from '@iyulab/chat-components';

interface UMessageElement extends HTMLElement {
  items: BlockItem[];
  timestamp?: string;
}

function ChatMessage({ items, timestamp }: { items: BlockItem[], timestamp?: string }) {
  const ref = useRef<UMessageElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.items = items;
      if (timestamp) ref.current.timestamp = timestamp;
    }
  }, [items, timestamp]);

  return <u-message ref={ref}></u-message>;
}
```

## Block Types

Message 컴포넌트는 다음 블록 타입을 지원합니다:

| Type | Component | Description |
|------|-----------|-------------|
| `text` | `<u-text-block>` | 일반 텍스트 |
| `markdown` | `<u-markdown-block>` | 마크다운 콘텐츠 |
| `thinking` | `<u-thinking-block>` | AI 추론 과정 |
| `tool` | `<u-tool-block>` | Tool 호출 결과 |

## Styling

CSS Parts를 사용하여 스타일 커스터마이징이 가능합니다:

```css
u-message::part(header) {
  /* 헤더 스타일 */
}

u-message::part(body) {
  /* 본문 스타일 */
}

u-message::part(footer) {
  /* 푸터 스타일 */
}
```
