# Button Components

## u-attach-button

파일 첨부 버튼입니다. 클릭 시 파일 탐색기가 열립니다.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `accept` | `string` | `'*'` | 허용 파일 타입 (예: `"image/*"`) |
| `multiple` | `boolean` | `false` | 다중 선택 여부 |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `u-change` | `{ files: File[] }` | 파일 선택 시 |

```html
<u-attach-button 
  multiple 
  accept="image/*" 
  @u-change=${(e) => console.log(e.detail.files)}
></u-attach-button>
```

---

## u-copy-button

클립보드 복사 버튼입니다. 복사 후 일정 시간 동안 체크 아이콘이 표시됩니다.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | - | 복사할 텍스트 |
| `delay` | `number` | `1000` | 복사 후 대기 시간(ms) |

```html
<u-copy-button value="복사할 텍스트"></u-copy-button>
```

---

## u-vote-button

투표(좋아요/싫어요) 버튼입니다.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `VoteValue` | `'none'` | 현재 투표 상태 |

**VoteValue**: `'none'` \| `'up'` \| `'down'`

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `u-change` | `{ value: VoteValue }` | 투표 상태 변경 시 |

```html
<u-vote-button 
  value="up" 
  @u-change=${(e) => console.log(e.detail.value)}
></u-vote-button>
```

---

## u-retry-button

메시지 재시도 버튼입니다.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `loading` | `boolean` | `false` | 재생성 중인지 여부 |

```html
<u-retry-button @click=${handleRetry}></u-retry-button>
```

---

## u-share-button

메시지 공유 버튼입니다.

```html
<u-share-button @click=${handleShare}></u-share-button>
```

---

## u-report-button

메시지 신고 버튼입니다.

```html
<u-report-button @click=${handleReport}></u-report-button>
```
