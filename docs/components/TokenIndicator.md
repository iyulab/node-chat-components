# TokenIndicator Component

`<u-token-indicator>` - 토큰 사용량 게이지 컴포넌트

## Overview

TokenIndicator는 LLM API의 토큰 사용량을 시각적으로 표시하는 게이지 컴포넌트입니다. 현재 사용량, 제한, 백분율을 보여줍니다.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `number` | `0` | 현재 토큰 사용량 |
| `maxValue` | `number` | `100_000_000` | 최대 토큰 제한 |
| `type` | `'panel' \| 'button'` | `'panel'` | 표시 모드 |

## Modes

| Mode | Description |
|------|-------------|
| `panel` | 전체 게이지 패널 표시 |
| `button` | 아이콘 버튼 + 툴팁으로 게이지 표시 |

## Features

- **Animated Gauge**: 값 변경 시 부드러운 애니메이션
- **Color Zones**: 사용량에 따른 색상 변화 (녹색 → 노랑 → 빨강)
- **Compact Format**: 큰 숫자를 K/M/B로 표시
- **Two Display Modes**: 패널 또는 버튼 모드

## Value Formatting

| Value | Display |
|-------|---------|
| 1,000 | 1K |
| 1,000,000 | 1M |
| 1,000,000,000 | 1B |

## Usage

### Panel Mode

```html
<u-token-indicator
  type="panel"
  .value=${50000}
  .maxValue=${200000}
></u-token-indicator>
```

### Button Mode (with Tooltip)

```html
<u-token-indicator
  type="button"
  .value=${150000}
  .maxValue=${200000}
></u-token-indicator>
```

### React Integration

```tsx
import { useRef, useEffect } from 'react';

interface UTokenIndicatorElement extends HTMLElement {
  value: number;
  maxValue: number;
  type?: 'panel' | 'button';
}

function TokenIndicator({
  usage,
  limit,
  mode = 'panel'
}: {
  usage: number;
  limit: number;
  mode?: 'panel' | 'button';
}) {
  const ref = useRef<UTokenIndicatorElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.value = usage;
      ref.current.maxValue = limit;
    }
  }, [usage, limit]);

  return <u-token-indicator ref={ref} type={mode} />;
}
```

### Real-time Updates

```tsx
function ChatWithTokenTracking() {
  const [tokenUsage, setTokenUsage] = useState(0);
  const TOKEN_LIMIT = 200000;

  const handleMessageComplete = (response) => {
    // Update token usage from API response
    setTokenUsage(prev => prev + response.usage.total_tokens);
  };

  return (
    <div className="chat-container">
      <header>
        <u-token-indicator
          type="button"
          .value=${tokenUsage}
          .maxValue=${TOKEN_LIMIT}
        />
      </header>
      <ChatMessages onMessageComplete={handleMessageComplete} />
    </div>
  );
}
```

### In Chat Header

```html
<header class="chat-header">
  <h1>Chat</h1>
  <div class="header-actions">
    <u-token-indicator
      type="button"
      .value=${sessionTokens}
      .maxValue=${contextLimit}
    />
    <button>Settings</button>
  </div>
</header>
```

## Gauge Zones

게이지는 세 개의 색상 구간으로 나뉩니다:

| Percentage | Color | Zone |
|------------|-------|------|
| 0-33% | 녹색 | 안전 |
| 34-66% | 노랑 | 주의 |
| 67-100% | 빨강 | 위험 |

## Styling

```css
u-token-indicator {
  --token-indicator-size: 200px;
  --token-indicator-font-family: system-ui;
}

/* Panel specific */
u-token-indicator[type="panel"] {
  --token-indicator-bg: var(--surface-default);
  --token-indicator-border-radius: 0.5rem;
  --token-indicator-padding: 1rem;
}

/* Button specific */
u-token-indicator[type="button"] {
  --token-indicator-button-size: 2rem;
}

/* Gauge colors */
u-token-indicator {
  --gauge-zone-1: var(--color-success);
  --gauge-zone-2: var(--color-warning);
  --gauge-zone-3: var(--color-error);
  --gauge-pointer: var(--color-text-primary);
}
```
