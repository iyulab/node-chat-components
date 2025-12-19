# Message Component

## u-message

AI 응답 메시지를 표시하는 컴포넌트입니다. 다양한 블록 타입(text, markdown, thinking, tool)을 포함할 수 있습니다.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `items` | `BlockItem[]` | 메시지 블록 배열 |
| `timestamp` | `string` | ISO 형식 타임스탬프 |

### BlockItem Types

```typescript
type BlockItem = TextBlockItem | MarkdownBlockItem | ThinkingBlockItem | ToolBlockItem;

interface TextBlockItem {
  type: "text";
  value?: string;
}

interface MarkdownBlockItem {
  type: "markdown";
  value?: string;
}

interface ThinkingBlockItem {
  type: "thinking";
  value?: string;
}

interface ToolBlockItem {
  type: "tool";
  status: "pending" | "paused" | "inProgress" | "success" | "failure";
  name?: string;
  input?: string;
  output?: string;
}
```

### Slots

| Slot | Description |
|------|-------------|
| `header` | 메시지 헤더 영역 |
| `footer` | 메시지 푸터 영역 |

### Usage

```html
<u-message 
  .items=${[
    { type: 'thinking', value: '분석 중...' },
    { type: 'tool', status: 'success', name: 'search', input: '{}', output: '{}' },
    { type: 'markdown', value: '# 결과\n내용입니다.' }
  ]}
  timestamp="2024-01-01T12:00:00Z"
>
  <span slot="header">🤖 Assistant</span>
</u-message>
```
