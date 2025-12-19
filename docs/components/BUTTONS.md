# Button Components

## u-attach-button

파일 첨부 버튼입니다. 클릭 시 파일 탐색기가 열립니다.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `accept` | `string` | - | 허용 파일 타입 (예: `"image/*"`) |
| `multiple` | `boolean` | `false` | 다중 선택 여부 |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `select-files` | `FileList` | 파일 선택 시 |

```html
<u-attach-button 
  multiple 
  accept="image/*" 
  @select-files=${(e) => console.log(e.detail)}
></u-attach-button>
```

---

## u-copy-button

클립보드 복사 버튼입니다.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | - | 복사할 텍스트 |
| `mode` | `'symbol'` \| `'badge'` | `'symbol'` | 표시 모드 |
| `delay` | `number` | `1000` | 복사 후 대기 시간(ms) |

```html
<u-copy-button value="복사할 텍스트" mode="badge"></u-copy-button>
```

---

## u-send-button

메시지 전송/중단/재시도 버튼입니다.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mode` | `'send'` \| `'stop'` \| `'retry'` | `'send'` | 버튼 모드 |
| `disabled` | `boolean` | `false` | 비활성화 상태 |

```html
<u-send-button mode="send" @click=${handleSend}></u-send-button>
```

---

## u-think-button

AI 추론 레벨을 설정하는 버튼입니다. 클릭하면 none → low → medium → high 순으로 변경됩니다.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `ThinkingValue` | `'none'` | 추론 레벨 |
| `disabled` | `boolean` | `false` | 비활성화 상태 |

**ThinkingValue**: `'none'` | `'low'` | `'medium'` | `'high'`

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `ThinkingValue` | 값 변경 시 |

```html
<u-think-button 
  value="low" 
  @change=${(e) => console.log(e.detail)}
></u-think-button>
```
