# ThinkingButton Component

`<u-thinking-button>` - 추론 레벨 선택 버튼 컴포넌트

## Overview

ThinkingButton은 AI 모델의 추론(Thinking) 레벨을 선택하는 토글 버튼입니다. Claude의 Extended Thinking과 같은 기능을 제어할 때 사용합니다.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `ThinkingValue` | `'none'` | 현재 추론 레벨 |
| `disabled` | `boolean` | `false` | 비활성화 상태 |

## Types

```typescript
type ThinkingValue = "none" | "low" | "medium" | "high";
```

## Events

| Event | Type | Description |
|-------|------|-------------|
| `change` | `CustomEvent<ThinkingValue>` | 추론 레벨 변경 시 발생 |

## States

| Value | Icon | Indicator | Description |
|-------|------|-----------|-------------|
| `none` | 💡 (off) | 0/3 bars | 추론 비활성화 |
| `low` | 💡 | 1/3 bars | 낮은 추론 |
| `medium` | 💡 | 2/3 bars | 중간 추론 |
| `high` | 💡 (filled) | 3/3 bars | 높은 추론 |

## Behavior

클릭할 때마다 순환: `none` → `low` → `medium` → `high` → `none`

## Usage

### Basic Usage

```html
<u-thinking-button
  @change=${(e) => console.log('Thinking level:', e.detail)}
></u-thinking-button>
```

### Controlled Value

```html
<u-thinking-button
  .value=${"medium"}
  @change=${(e) => setThinkingLevel(e.detail)}
></u-thinking-button>
```

### Disabled State

```html
<u-thinking-button
  disabled
  .value=${"high"}
></u-thinking-button>
```

### React Integration

```tsx
import { useRef, useEffect, useState } from 'react';

type ThinkingValue = "none" | "low" | "medium" | "high";

interface UThinkingButtonElement extends HTMLElement {
  value: ThinkingValue;
  disabled?: boolean;
}

interface ChangeEvent extends CustomEvent<ThinkingValue> {}

function ThinkingButton({
  value,
  onChange,
  disabled
}: {
  value: ThinkingValue;
  onChange: (value: ThinkingValue) => void;
  disabled?: boolean;
}) {
  const ref = useRef<UThinkingButtonElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.value = value;
    }
  }, [value]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handler = (e: ChangeEvent) => {
      onChange(e.detail);
    };

    el.addEventListener('change', handler as EventListener);
    return () => el.removeEventListener('change', handler as EventListener);
  }, [onChange]);

  return <u-thinking-button ref={ref} disabled={disabled} />;
}
```

### Full Chat Input Example

```tsx
function ChatInputWithThinking() {
  const [thinkingLevel, setThinkingLevel] = useState<ThinkingValue>('none');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    sendMessage({
      content: message,
      thinkingLevel: thinkingLevel !== 'none' ? thinkingLevel : undefined
    });
  };

  return (
    <div className="chat-input">
      <u-thinking-button
        .value=${thinkingLevel}
        @change=${(e) => setThinkingLevel(e.detail)}
      />
      <u-text-block
        editable
        .value=${message}
        @input=${(e) => setMessage(e.target.value)}
      />
      <u-send-button @click=${handleSubmit} />
    </div>
  );
}
```

## Mapping to API Parameters

```typescript
// Claude API budget_tokens mapping example
function getThinkingBudget(level: ThinkingValue): number | undefined {
  switch (level) {
    case 'low': return 1024;
    case 'medium': return 4096;
    case 'high': return 16384;
    default: return undefined;
  }
}
```

## Styling

```css
u-thinking-button {
  --thinking-button-size: 2rem;
  --thinking-button-color: var(--color-text-secondary);
  cursor: pointer;
}

u-thinking-button[value="low"] {
  --thinking-button-color: var(--color-warning-light);
}

u-thinking-button[value="medium"] {
  --thinking-button-color: var(--color-warning);
}

u-thinking-button[value="high"] {
  --thinking-button-color: var(--color-warning-dark);
}

u-thinking-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
```
