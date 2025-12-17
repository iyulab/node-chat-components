# AttachButton Component

`<u-attach-button>` - 파일 첨부 버튼 컴포넌트

## Overview

AttachButton은 파일 선택 다이얼로그를 열어 파일을 첨부하는 버튼 컴포넌트입니다.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `accept` | `string` | `undefined` | 허용할 파일 타입 (MIME) |
| `multiple` | `boolean` | `false` | 다중 선택 허용 |

## Events

| Event | Type | Description |
|-------|------|-------------|
| `select-files` | `CustomEvent<FileList>` | 파일 선택 시 발생 |

## Usage

### Basic Usage

```html
<u-attach-button
  @select-files=${(e) => handleFiles(e.detail)}
></u-attach-button>
```

### Image Only

```html
<u-attach-button
  accept="image/*"
  @select-files=${handleImageUpload}
></u-attach-button>
```

### Multiple Files

```html
<u-attach-button
  multiple
  accept="image/*,application/pdf"
  @select-files=${handleMultipleFiles}
></u-attach-button>
```

### React Integration

```tsx
import { useRef, useEffect, useCallback } from 'react';

interface UAttachButtonElement extends HTMLElement {
  accept?: string;
  multiple?: boolean;
}

interface SelectFilesEvent extends CustomEvent<FileList> {}

function AttachButton({
  accept,
  multiple,
  onFilesSelected
}: {
  accept?: string;
  multiple?: boolean;
  onFilesSelected: (files: FileList) => void;
}) {
  const ref = useRef<UAttachButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handler = (e: SelectFilesEvent) => {
      onFilesSelected(e.detail);
    };

    el.addEventListener('select-files', handler as EventListener);
    return () => el.removeEventListener('select-files', handler as EventListener);
  }, [onFilesSelected]);

  return (
    <u-attach-button
      ref={ref}
      accept={accept}
      multiple={multiple}
    />
  );
}
```

### Full Example with Preview

```tsx
function ChatInputWithAttachments() {
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleFilesSelected = (files: FileList) => {
    setAttachments(prev => [...prev, ...Array.from(files)]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="chat-input-with-attachments">
      {attachments.length > 0 && (
        <div className="attachments-preview">
          {attachments.map((file, i) => (
            <div key={i} className="attachment">
              <span>{file.name}</span>
              <button onClick={() => removeAttachment(i)}>×</button>
            </div>
          ))}
        </div>
      )}
      <div className="input-row">
        <u-attach-button
          accept="image/*,.pdf,.doc,.docx"
          multiple
          @select-files=${(e) => handleFilesSelected(e.detail)}
        />
        <u-text-block editable placeholder="Type a message..." />
        <u-send-button mode="send" />
      </div>
    </div>
  );
}
```

## Accept MIME Types

| Pattern | Description |
|---------|-------------|
| `image/*` | 모든 이미지 파일 |
| `video/*` | 모든 비디오 파일 |
| `audio/*` | 모든 오디오 파일 |
| `application/pdf` | PDF 파일 |
| `.doc,.docx` | Word 문서 |
| `.xls,.xlsx` | Excel 문서 |
| `text/*` | 모든 텍스트 파일 |

## Styling

```css
u-attach-button {
  --attach-button-size: 2rem;
  --attach-button-color: var(--color-text-secondary);
  cursor: pointer;
}

u-attach-button:hover {
  --attach-button-color: var(--color-primary);
}
```
