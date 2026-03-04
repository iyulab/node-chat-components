# Message Component

## u-message

채팅 메시지를 표시하는 컨테이너 컴포넌트입니다. 블록 요소들을 **slot(light DOM)**으로 받아 표시합니다.

> ⚠️ `u-message`는 `items` property를 갖지 않습니다. 블록 요소를 직접 자식으로 넣어야 합니다.

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `MessageVariant` | `'default'` | 메시지 스타일 |
| `position` | `MessagePosition` | `'left'` | 메시지 위치 |
| `loading` | `boolean` | `false` | 로딩 상태 (footer slot 숨김) |

**MessageVariant**: `'default'` \| `'bubble'`

**MessagePosition**: `'left'` \| `'right'`

### Slots

| Slot | Description |
|------|-------------|
| `header` | 메시지 헤더 영역 |
| *(default)* | 블록 컴포넌트 영역 (`u-think-block`, `u-marked-block` 등) |
| `footer` | 메시지 푸터 영역 (`loading=true`일 때 숨김) |

### Usage

블록 요소를 직접 자식으로 배치합니다. 각 블록의 data property는 JS property 바인딩(`.prop=`)으로 전달합니다.

```html
<u-message variant="default" position="left">
  <u-think-block .value=${'분석 중...'}></u-think-block>
  <u-tool-block heading="search" .input=${{ query: '서울 날씨' }} .output=${{ temp: 22 }}></u-tool-block>
  <u-marked-block .value=${'# 결과\n내용입니다.'} .refs=${[]}></u-marked-block>
  <u-ref-block heading="References" .sources=${sources}></u-ref-block>
  <div slot="footer">
    <u-vote-button value="none"></u-vote-button>
  </div>
</u-message>
```

### BlockItem Types

`BlockItem`은 메시지 데이터의 타입 정의입니다. 각 타입에 대응하는 블록 컴포넌트가 있습니다.

```typescript
type BlockItem =
  | TextBlockItem
  | MarkdownBlockItem
  | ThinkingBlockItem
  | ToolBlockItem
  | ReferenceBlockItem
  | FilesBlockItem;
```

| BlockItem type | 대응 컴포넌트 | 주요 프로퍼티 |
|----------------|-------------|-------------|
| `"text"` | `u-text-block` | `value` |
| `"markdown"` | `u-marked-block` | `value`, `refs` (JS property) |
| `"thinking"` | `u-think-block` | `value`, `loading` |
| `"tool"` | `u-tool-block` | `heading`, `input` (JS property), `output` (JS property) |
| `"reference"` | `u-ref-block` | `heading`, `sources` (JS property) |

> **배열/객체 프로퍼티** (`refs`, `input`, `output`, `sources`)는 HTML attribute로 전달할 수 없습니다.
> Lit 템플릿은 `.prop=`, 명령형 코드는 `element.prop = value`로 설정하세요.

### React Integration

React에서 사용할 때는 `ref` + `useEffect`로 배열/객체 프로퍼티를 설정합니다.

```tsx
function MarkdownBlock({ item }: { item: MarkdownBlockItem }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (ref.current) (ref.current as any).refs = item.refs ?? [];
  }, [item.refs]);
  return <u-marked-block ref={ref} value={item.value ?? ''} />;
}
```
