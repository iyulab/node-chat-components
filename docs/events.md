# Events System

`@iyulab/chat-components` uses Custom Events for component communication.

## Event Overview

| Component | Event | Detail Type | Description |
|-----------|-------|-------------|-------------|
| `u-send-button` | `click` | - | 버튼 클릭 (send/stop/retry) |
| `u-text-block` | `input` | - | 텍스트 입력 변경 |
| `u-thinking-button` | `change` | `ThinkingValue` | 추론 레벨 변경 |
| `u-attach-button` | `select-files` | `FileList` | 파일 선택 완료 |
| `u-tool-block` | `tool-approval` | `{ id, approved }` | 도구 승인/거부 |

## Event Details

### u-submit (TextBlock)

텍스트 입력 제출 이벤트.

```typescript
interface SubmitEvent extends CustomEvent<string> {
  detail: string; // 제출된 텍스트
}

// Usage
element.addEventListener('u-submit', (e: SubmitEvent) => {
  console.log('Submitted:', e.detail);
});
```

### change (ThinkingButton)

추론 레벨 변경 이벤트.

```typescript
type ThinkingValue = 'none' | 'low' | 'medium' | 'high';

interface ChangeEvent extends CustomEvent<ThinkingValue> {
  detail: ThinkingValue;
}

// Usage
element.addEventListener('change', (e: ChangeEvent) => {
  console.log('Thinking level:', e.detail);
});
```

### select-files (AttachButton)

파일 선택 이벤트.

```typescript
interface SelectFilesEvent extends CustomEvent<FileList> {
  detail: FileList;
}

// Usage
element.addEventListener('select-files', (e: SelectFilesEvent) => {
  for (const file of e.detail) {
    console.log('File:', file.name, file.size);
  }
});
```

### tool-approval (ToolBlock)

도구 승인/거부 이벤트 (Human-in-the-loop).

```typescript
interface ToolApprovalEvent extends CustomEvent<{
  id: string;
  approved: boolean;
}> {}

// Usage
element.addEventListener('tool-approval', (e: ToolApprovalEvent) => {
  const { id, approved } = e.detail;
  if (approved) {
    console.log(`Tool ${id} approved`);
  } else {
    console.log(`Tool ${id} denied`);
  }
});
```

## React Integration Pattern

Web Components의 Custom Events를 React에서 사용하는 패턴:

```tsx
import { useRef, useEffect, useCallback } from 'react';

function MyComponent({ onSubmit }: { onSubmit: (value: string) => void }) {
  const ref = useRef<HTMLElement>(null);

  // Memoize handler to prevent unnecessary re-subscriptions
  const handleSubmit = useCallback((e: Event) => {
    const customEvent = e as CustomEvent<string>;
    onSubmit(customEvent.detail);
  }, [onSubmit]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener('u-submit', handleSubmit);
    return () => {
      el.removeEventListener('u-submit', handleSubmit);
    };
  }, [handleSubmit]);

  return <u-text-block ref={ref} editable />;
}
```

## Event Bubbling

모든 Custom Events는 `bubbles: true`로 설정되어 부모 요소에서도 캡처할 수 있습니다:

```html
<div id="chat-container">
  <u-message>
    <u-tool-block status="paused">...</u-tool-block>
  </u-message>
</div>

<script>
  // Listen at container level
  document.getElementById('chat-container')
    .addEventListener('tool-approval', (e) => {
      console.log('Tool approval from child:', e.detail);
    });
</script>
```

## TypeScript Type Definitions

```typescript
// Import types for use in React/TypeScript projects
import type {
  BlockItem,
  TextBlockItem,
  MarkdownBlockItem,
  ThinkingBlockItem,
  ToolBlockItem,
  ToolBlockStatus,
} from '@iyulab/chat-components';

// Custom event types (define in your project)
type ThinkingValue = 'none' | 'low' | 'medium' | 'high';

interface ToolApprovalEvent extends CustomEvent<{
  id: string;
  approved: boolean;
}> {}

interface SelectFilesEvent extends CustomEvent<FileList> {}
```
