# Prompt Component

## u-prompt

채팅 입력 컴포넌트입니다. 텍스트 입력 영역과 좌우측에 액션 버튼을 배치할 수 있는 슬롯을 제공합니다.

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `loading` | `boolean` | `false` | 로딩 상태 여부 (전송 중 상태) |
| `minRows` | `number` | `1` | 입력 필드 최소 행 수 |
| `maxRows` | `number` | `10` | 입력 필드 최대 행 수 |
| `placeholder` | `string` | - | 입력 필드 플레이스홀더 텍스트 |
| `value` | `string` | - | 입력 필드의 값 |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `u-submit` | `{ value: string }` | 전송 버튼 클릭 또는 Enter 키 입력 시 |
| `u-cancel` | - | 로딩 중 전송 버튼 클릭 시 (중단) |

### Slots

| Slot | Description |
|------|-------------|
| `header` | 프롬프트 상단 영역 |
| `footer` | 프롬프트 하단 영역 |
| `left-actions` | 입력 필드 좌측 액션 버튼 영역 |
| `right-actions` | 입력 필드 우측 액션 버튼 영역 |

### Methods

| Method | Description |
|--------|-------------|
| `send()` | 메시지를 전송합니다. 로딩 중이면 u-cancel 이벤트를, 값이 있으면 u-submit 이벤트를 발생시킵니다. |

### Behavior

- **Enter 키**: 메시지 전송 (u-submit 이벤트)
- **Shift + Enter**: 줄바꿈
- **전송 버튼**: 
  - 일반 상태: 입력값이 있을 때만 활성화되며, 클릭 시 메시지 전송
  - 로딩 상태: 중단 아이콘으로 변경되며, 클릭 시 전송 취소 (u-cancel 이벤트)

### Usage

```html
<u-prompt
  placeholder="메시지를 입력하세요..."
  .minRows=${1}
  .maxRows=${10}
  @u-submit=${(e) => handleSubmit(e.detail.value)}
  @u-cancel=${() => handleCancel()}
>
  <div slot="left-actions">
    <u-attach-button></u-attach-button>
  </div>
</u-prompt>
```

### Example with Loading State

```typescript
const prompt = document.querySelector('u-prompt');

// 메시지 전송 처리
prompt.addEventListener('u-submit', async (e) => {
  prompt.loading = true;
  
  try {
    await sendMessage(e.detail.value);
  } catch (error) {
    console.error(error);
  } finally {
    prompt.loading = false;
  }
});

// 전송 취소 처리
prompt.addEventListener('u-cancel', () => {
  // 전송 중단 로직
  abortRequest();
  prompt.loading = false;
});
```
