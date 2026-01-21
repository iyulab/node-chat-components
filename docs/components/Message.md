# Message Component

## u-message

채팅 메시지를 표시하는 컴포넌트입니다. 다양한 블록 타입(text, markdown, thinking, tool)을 포함할 수 있습니다.

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `MessageVariant` | `'default'` | 메시지 스타일 |
| `position` | `MessagePosition` | `'left'` | 메시지 위치 |
| `loading` | `boolean` | `false` | 로딩 상태 |
| `items` | `BlockItem[]` | - | 메시지 블록 배열 |

**MessageVariant**: `'default'` \| `'bubble'`

**MessagePosition**: `'left'` \| `'right'`

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
  refs?: BlockReference[];
}

interface ThinkingBlockItem {
  type: "thinking";
  value?: string;
}

interface ToolBlockItem {
  type: "tool";
  title?: string;
  input?: JsonNode;
  output?: JsonNode;
}
```

### Slots

| Slot | Description |
|------|-------------|
| `header` | 메시지 헤더 영역 |
| `footer` | 메시지 푸터 영역 (loading=true일 때 숨김) |

### Usage

```html
<u-message 
  variant="default"
  position="left"
  .items=${[
    { type: 'thinking', value: '분석 중...' },
    { type: 'tool', title: 'search', input: {}, output: {} },
    { type: 'markdown', value: '# 결과\n내용입니다.' }
  ]}
>
  <span slot="header">🤖 Assistant</span>
</u-message>
```
