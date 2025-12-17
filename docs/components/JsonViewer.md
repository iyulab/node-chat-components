# JsonViewer Component

`<u-json-viewer>` - JSON 트리 뷰어 컴포넌트

## Overview

JsonViewer는 JSON 데이터를 트리 형태로 시각화하는 컴포넌트입니다. ToolBlock 내에서 Tool 입력/출력을 표시하는 데 사용됩니다.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `JsonNode` | `{}` | JSON 데이터 |
| `expanded` | `boolean` | `true` | 초기 확장 상태 |

## Types

```typescript
type JsonValue = string | number | boolean | null;
type JsonArray = JsonNode[];
type JsonObject = Record<string, JsonNode>;
type JsonNode = JsonValue | JsonArray | JsonObject;
```

## Features

- **Tree View**: 중첩된 JSON 구조를 트리로 표시
- **Collapsible**: 객체/배열 노드 접기/펼치기
- **Type Highlighting**: 타입별 다른 색상 표시
- **Preview**: 접힌 상태에서 미리보기 표시
- **Keyboard Navigation**: 키보드로 탐색 가능

## Type Colors

| Type | CSS Part | Example |
|------|----------|---------|
| `string` | `::part(string)` | "hello" |
| `number` | `::part(number)` | 42 |
| `boolean` | `::part(boolean)` | true |
| `null` | `::part(null)` | null |

## Usage

### Basic Usage

```html
<u-json-viewer
  .value=${{ name: "John", age: 30 }}
></u-json-viewer>
```

### With String Input

```html
<u-json-viewer
  .value=${'{"name": "John", "age": 30}'}
></u-json-viewer>
```

### Initially Collapsed

```html
<u-json-viewer
  .expanded=${false}
  .value=${complexData}
></u-json-viewer>
```

### React Integration

```tsx
import { useRef, useEffect } from 'react';

interface UJsonViewerElement extends HTMLElement {
  value: object | string;
  expanded?: boolean;
}

function JsonViewer({
  data,
  expanded = true
}: {
  data: object | string;
  expanded?: boolean;
}) {
  const ref = useRef<UJsonViewerElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.value = data;
      ref.current.expanded = expanded;
    }
  }, [data, expanded]);

  return <u-json-viewer ref={ref} />;
}
```

### Complex Nested Data

```html
<u-json-viewer
  .value=${{
    user: {
      name: "John Doe",
      email: "john@example.com",
      preferences: {
        theme: "dark",
        notifications: true
      }
    },
    items: [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" }
    ],
    metadata: {
      created: "2024-01-15T10:30:00Z",
      count: 42,
      active: true,
      notes: null
    }
  }}
></u-json-viewer>
```

## Preview Format

접힌 상태의 미리보기 형식:

- **Array**: `[ 3 items ]`
- **Object**: `{ 5 properties }`
- **Empty Array**: `[ ]`
- **Empty Object**: `{ }`

## Styling

```css
u-json-viewer {
  --json-viewer-font-family: monospace;
  --json-viewer-font-size: 0.875rem;
  --json-viewer-line-height: 1.5;
}

u-json-viewer::part(key) {
  color: var(--color-json-key);
}

u-json-viewer::part(string) {
  color: var(--color-json-string);
}

u-json-viewer::part(number) {
  color: var(--color-json-number);
}

u-json-viewer::part(boolean) {
  color: var(--color-json-boolean);
}

u-json-viewer::part(null) {
  color: var(--color-json-null);
}

u-json-viewer::part(preview) {
  color: var(--color-text-secondary);
  font-style: italic;
}
```
