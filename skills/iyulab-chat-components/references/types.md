# Types

## BlockItem

```ts
import type { BlockItem } from '@iyulab/chat-components';
```

Union type for all message content blocks. Used to exchange structured message data with a server API.

```ts
type BlockItem =
  | ThinkingBlockItem
  | TextBlockItem
  | MarkdownBlockItem
  | FileBlockItem
  | ToolBlockItem
  | ReferenceBlockItem;
```

### ThinkingBlockItem → `u-think-block`

```ts
interface ThinkingBlockItem {
  type: 'thinking';
  loading?: boolean;  // Streaming in progress
  value?: string;     // Reasoning text content
}
```

### TextBlockItem → `u-text-block`

```ts
interface TextBlockItem {
  type: 'text';
  value?: string;
}
```

### MarkdownBlockItem → `u-marked-block`

```ts
interface MarkdownBlockItem {
  type: 'markdown';
  value?: string;
  refs?: ReferenceCitation[];
}
```

### FileBlockItem → `u-file-block` / `u-prompt.files`

```ts
interface FileBlockItem {
  type: 'file';
  status?: 'idle' | 'uploading' | 'error';
  name?: string;      // File name
  size?: number;      // File size in bytes
  mimeType?: string;  // MIME type, e.g. "image/png"
  url?: string;       // Download URL
  data?: any;
}
```

### ToolBlockItem → `u-tool-block`

```ts
interface ToolBlockItem {
  type: 'tool';
  loading?: boolean;
  title?: string;
  input?: JsonNode;
  output?: JsonNode;
}
```

### ReferenceBlockItem → `u-ref-block`

```ts
interface ReferenceBlockItem {
  type: 'reference';
  sources: ReferenceSource[];
}
```

---

## ReferenceSource & ReferenceCitation

```ts
interface ReferenceSource {
  type: 'web' | 'document';
  url?: string;
  title?: string;
  snippet?: string;
  tags?: string[];
}

interface ReferenceCitation {
  startIndex: number;  // Start char index in markdown text
  endIndex: number;    // End char index
  label?: string;      // Display label, e.g. "[1]"
  sources: ReferenceSource[];
}
```

---

## JsonNode

```ts
type JsonValue  = string | number | boolean | null;
type JsonArray  = JsonNode[];
type JsonObject = { [key: string]: JsonNode };
type JsonNode   = JsonValue | JsonArray | JsonObject;
```
