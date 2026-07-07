# Types

## BlockItem

```ts
import type { BlockItem } from '@iyulab/chat-components';
```

Union type for all message content blocks. Used to exchange structured message data with a server API.

```ts
type BlockItem =
  | TextBlockItem
  | MarkdownBlockItem
  | FileBlockItem
  | ReferenceBlockItem;
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
  name?: string;      // File name
  size?: number;      // File size in bytes
  mimeType?: string;  // MIME type, e.g. "image/png"
  url?: string;       // File URL (used for image/video thumbnail + preview)
  data?: any;
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

## JsonSchema & ElementSchema

Used by [`ElementPromptBuilder`](./utilities/prompt-builder.md) to describe extra/element schemas for the LLM system prompt (see [extra-system.md](./extra-system.md)).

```ts
type JsonSchema =
  | { type: 'boolean'; description?: string; default?: any; enum?: any[]; examples?: any[] }
  | { type: 'string'; minLength?: number; maxLength?: number; /* + base fields above */ }
  | { type: 'number' | 'integer'; minimum?: number; maximum?: number; /* + base fields above */ }
  | { type: 'array'; items?: JsonSchema; minItems?: number; maxItems?: number; /* + base fields above */ }
  | { type: 'object'; properties?: Record<string, JsonSchema>; required?: string[]; additionalProperties?: boolean; /* + base fields above */ };

interface ElementSchema {
  tag: string;                                 // Custom element tag to register
  description: string;                         // LLM-facing description
  properties?: Record<string, JsonSchema>;     // LLM-facing property schema
  required?: string[];                         // Required property names
}
```
