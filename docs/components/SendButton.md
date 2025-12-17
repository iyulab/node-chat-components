# SendButton Component

`<u-send-button>` - 전송/중지/재시도 버튼 컴포넌트

## Overview

SendButton은 채팅 메시지 전송, 생성 중지, 재시도 기능을 제공하는 버튼 컴포넌트입니다.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mode` | `'send' \| 'stop' \| 'retry'` | `'send'` | 버튼 모드 |
| `disabled` | `boolean` | `false` | 비활성화 상태 |

## Modes

| Mode | Icon | Description |
|------|------|-------------|
| `send` | ↑ (arrow-up) | 메시지 전송 |
| `stop` | ■ (square-fill) | 생성 중지 |
| `retry` | ↻ (arrow-clockwise) | 재시도 |

## Usage

### Basic Usage

```html
<!-- Send mode -->
<u-send-button mode="send"></u-send-button>

<!-- Stop mode (during streaming) -->
<u-send-button mode="stop"></u-send-button>

<!-- Retry mode -->
<u-send-button mode="retry"></u-send-button>
```

### With Disabled State

```html
<u-send-button
  mode="send"
  ?disabled=${!hasInput}
></u-send-button>
```

### React Integration

```tsx
import { useRef, useEffect, useCallback } from 'react';

interface USendButtonElement extends HTMLElement {
  mode: 'send' | 'stop' | 'retry';
  disabled?: boolean;
}

function SendButton({
  isLoading,
  hasError,
  hasInput,
  onSend,
  onStop,
  onRetry
}: {
  isLoading: boolean;
  hasError: boolean;
  hasInput: boolean;
  onSend: () => void;
  onStop: () => void;
  onRetry: () => void;
}) {
  const ref = useRef<USendButtonElement>(null);

  const mode = hasError ? 'retry' : isLoading ? 'stop' : 'send';
  const disabled = mode === 'send' && !hasInput;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleClick = () => {
      if (mode === 'stop') onStop();
      else if (mode === 'retry') onRetry();
      else if (!disabled) onSend();
    };

    el.addEventListener('click', handleClick);
    return () => el.removeEventListener('click', handleClick);
  }, [mode, disabled, onSend, onStop, onRetry]);

  return (
    <u-send-button
      ref={ref}
      mode={mode}
      disabled={disabled}
    />
  );
}
```

### Full Chat Input Example

```tsx
function ChatInput({ onSubmit, onStop, isLoading }) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  return (
    <div className="chat-input">
      <u-text-block
        editable
        value={value}
        @input=${(e) => setValue(e.target.value)}
      />
      <u-send-button
        mode={isLoading ? 'stop' : 'send'}
        disabled={!isLoading && !value.trim()}
        @click=${isLoading ? onStop : handleSubmit}
      />
    </div>
  );
}
```

## Styling

```css
u-send-button {
  --send-button-size: 2.5rem;
  --send-button-bg: var(--color-primary);
  --send-button-color: var(--color-on-primary);
  --send-button-border-radius: 50%;
}

u-send-button[disabled] {
  --send-button-bg: var(--color-disabled);
  cursor: not-allowed;
}

u-send-button[mode="stop"] {
  --send-button-bg: var(--color-error);
}
```
