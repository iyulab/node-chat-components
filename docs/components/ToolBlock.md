# ToolBlock Component

`<u-tool-block>` - Tool 호출 표시 컴포넌트

## Overview

ToolBlock은 LLM의 Tool/Function 호출 결과를 표시하는 컴포넌트입니다. Tool의 이름, 입력, 출력을 JSON 트리 형태로 표시하며, Human-in-the-loop 승인 UI를 제공합니다.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `status` | `ToolBlockStatus` | `'pending'` | Tool 실행 상태 |
| `name` | `string` | `undefined` | Tool 이름 |
| `input` | `string` | `undefined` | Tool 입력 (JSON string) |
| `output` | `string` | `undefined` | Tool 출력 (JSON string) |
| `index` | `number` | `undefined` | Tool 호출 인덱스 |
| `collapsed` | `boolean` | `true` | 접힘 상태 |

## Status Types

```typescript
type ToolBlockStatus =
  | "pending"      // 대기 중
  | "paused"       // 승인 대기 (Human-in-the-loop)
  | "inProgress"   // 실행 중
  | "success"      // 성공
  | "failure";     // 실패
```

## Events

| Event | Type | Description |
|-------|------|-------------|
| `tool-approval` | `CustomEvent<{ index: number, isApproved: boolean }>` | Tool 승인/거부 |

## Features

- **Status Indicators**: 상태별 아이콘 표시
- **JSON Tree View**: 입력/출력을 `<u-json-viewer>`로 표시
- **Collapsible**: 클릭으로 펼치기/접기
- **Human-in-the-loop**: `paused` 상태에서 승인/거부 버튼 표시

## Status Icons

| Status | Icon | Description |
|--------|------|-------------|
| `pending` | ⏸️ | Pause icon |
| `paused` | ⏸️ | Pause icon (with approval buttons) |
| `inProgress` | 🔄 | Spinner |
| `success` | ✅ | Check icon |
| `failure` | ❌ | X icon |

## Usage

### Basic Usage

```html
<u-tool-block
  status="success"
  name="search_web"
  input='{"query": "weather today"}'
  output='{"temperature": 25, "condition": "sunny"}'
></u-tool-block>
```

### In Progress

```html
<u-tool-block
  status="inProgress"
  name="read_file"
  input='{"path": "/data/config.json"}'
></u-tool-block>
```

### Human-in-the-loop (Approval Required)

```html
<u-tool-block
  status="paused"
  name="delete_file"
  input='{"path": "/important/data.txt"}'
  @tool-approval=${(e) => handleApproval(e.detail)}
></u-tool-block>
```

### React Integration

```tsx
import { useRef, useEffect, useCallback } from 'react';
import type { ToolBlockStatus } from '@iyulab/chat-components';

interface UToolBlockElement extends HTMLElement {
  status: ToolBlockStatus;
  name?: string;
  input?: string;
  output?: string;
  index?: number;
}

interface ToolApprovalEvent extends CustomEvent<{ index: number; isApproved: boolean }> {}

function ToolDisplay({
  tool,
  onApproval
}: {
  tool: { name: string; status: ToolBlockStatus; input?: string; output?: string };
  onApproval?: (approved: boolean) => void;
}) {
  const ref = useRef<UToolBlockElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.status = tool.status;
      ref.current.name = tool.name;
      if (tool.input) ref.current.input = tool.input;
      if (tool.output) ref.current.output = tool.output;
    }
  }, [tool]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !onApproval) return;

    const handler = (e: ToolApprovalEvent) => {
      onApproval(e.detail.isApproved);
    };

    el.addEventListener('tool-approval', handler as EventListener);
    return () => el.removeEventListener('tool-approval', handler as EventListener);
  }, [onApproval]);

  return <u-tool-block ref={ref}></u-tool-block>;
}
```

### Streaming Tool Updates

```typescript
// Tool 호출 시작
updateBlock({
  type: 'tool',
  status: 'inProgress',
  name: 'search',
  input: JSON.stringify({ query: 'test' })
});

// Tool 완료
updateBlock({
  type: 'tool',
  status: 'success',
  name: 'search',
  input: JSON.stringify({ query: 'test' }),
  output: JSON.stringify({ results: [...] })
});
```

## Styling

```css
u-tool-block {
  --tool-block-border-radius: 0.5rem;
  --tool-block-header-bg: var(--surface-subtle);
  --tool-block-body-bg: var(--surface-default);
}

/* Status-specific styles */
u-tool-block[status="success"] {
  --tool-block-accent: var(--color-success);
}

u-tool-block[status="failure"] {
  --tool-block-accent: var(--color-error);
}
```
