# TextBlock Component

`<u-text-block>` - 텍스트 입력/표시 컴포넌트

## Overview

TextBlock은 텍스트를 표시하거나 편집할 수 있는 블록 컴포넌트입니다. 채팅 입력창이나 텍스트 표시 영역으로 사용됩니다.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `undefined` | 텍스트 내용 |
| `editable` | `boolean` | `false` | 편집 가능 여부 |
| `placeholder` | `string` | `undefined` | 플레이스홀더 텍스트 |
| `spellcheck` | `boolean` | `false` | 스펠체크 활성화 |
| `minRows` | `number` | `1` | 최소 행 수 |
| `maxRows` | `number` | `undefined` | 최대 행 수 |

## Methods

| Method | Description |
|--------|-------------|
| `focus(options?)` | textarea에 포커스 |

## Events

| Event | Type | Description |
|-------|------|-------------|
| `input` | `InputEvent` | 텍스트 입력 시 발생 |

## Features

- **Auto-resize**: 내용에 따라 자동으로 높이 조절
- **Min/Max Rows**: 최소/최대 행 수 제한 가능
- **Read-only Mode**: `editable=false`로 읽기 전용 표시

## Usage

### Display Mode (Read-only)

```html
<u-text-block
  .value=${"This is a read-only text message."}
></u-text-block>
```

### Input Mode (Editable)

```html
<u-text-block
  editable
  placeholder="Type a message..."
  minRows=${1}
  maxRows=${6}
  @input=${(e) => console.log(e.target.value)}
></u-text-block>
```

### React Integration

```tsx
import { useRef, useEffect, useCallback } from 'react';

interface UTextBlockElement extends HTMLElement {
  value: string;
  editable?: boolean;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  focus(): void;
}

function ChatInput({ value, onChange, onSubmit }) {
  const ref = useRef<UTextBlockElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.value !== value) {
      ref.current.value = value;
    }
  }, [value]);

  const handleInput = useCallback((e: Event) => {
    const target = e.target as UTextBlockElement;
    onChange(target.value || '');
  }, [onChange]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(value);
    }
  }, [value, onSubmit]);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.addEventListener('input', handleInput);
      el.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      if (el) {
        el.removeEventListener('input', handleInput);
        el.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [handleInput, handleKeyDown]);

  return (
    <u-text-block
      ref={ref}
      editable
      placeholder="Type a message..."
      minRows={1}
      maxRows={6}
    />
  );
}
```

## Styling

```css
u-text-block {
  --text-block-padding: 0.75rem 1rem;
  --text-block-font-size: 1rem;
  --text-block-line-height: 1.5;
  --text-block-border-radius: 0.5rem;
}
```
