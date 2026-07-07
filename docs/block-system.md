# Block System

Blocks are the individual content units inside a `u-message`. Each block maps to a `BlockItem` type and a corresponding custom element.

---

## BlockItem Types

```ts
type BlockItem =
  | TextBlockItem        →  u-text-block
  | MarkdownBlockItem    →  u-marked-block
  | FileBlockItem        →  u-file-block
  | ReferenceBlockItem   →  u-ref-block
```

See [`../types/BlockItem.ts`](../src/types/BlockItem.ts) for full type definitions.

---

## u-marked-block

The primary block for LLM text output. Parses markdown and handles several special sub-renderers:

| Input | Rendered as |
|-------|-------------|
| Regular markdown | HTML (headings, bold, lists, links…) |
| `` ```lang ``` `` | `u-code-block` |
| `\| table \|` | `u-table-block` |
| KaTeX `$...$` | MathML via `marked-katex-extension` |
| `` ```block-json ``` `` | `u-element-block` → extra component (see [docs/extras-system.md](./extras-system.md)) |
| `refs` citations | `u-ref-tag` inserted inline |

**Debouncing:** updates are batched with an 80ms delay, which smooths out high-frequency streaming writes.

```ts
// Streaming update pattern
let accumulated = '';
for await (const chunk of stream) {
  accumulated += chunk;
  block.value = accumulated;   // debounced internally
}
```

**Citation injection:**

```ts
block.value = 'The Earth orbits the Sun[1] at 1 AU.';
block.refs = [{
  startIndex: 28, endIndex: 31,
  label: '[1]',
  sources: [{ type: 'web', url: 'https://...', title: 'NASA' }]
}];
```

---

## u-file-block

Represents a single attached or received file. When used inside `u-prompt` (via `files` prop), add `removable` to show a delete button.

Images and videos (when `url` is set) render an actual thumbnail instead of a generic icon, and clicking the thumbnail opens a full-size preview overlay. Other file types keep the type-based icon.

```ts
// Reading file input
fileInput.addEventListener('change', (e) => {
  const files = Array.from((e.target as HTMLInputElement).files ?? []);
  const newFiles = files.map((f: File) => ({
    type: 'file' as const,
    name: f.name, size: f.size, mimeType: f.type,
  }));
  prompt.files = [...(prompt.files ?? []), ...newFiles];
});
```

---

## u-ref-block

Groups multiple reference sources in a collapsible block. Typically placed after the main content to list LLM citations.

```ts
const refBlock = document.createElement('u-ref-block') as any;
refBlock.title   = 'Sources';
refBlock.sources = [
  { type: 'web',      url: 'https://...', title: 'Article', snippet: '...' },
  { type: 'document', title: 'Internal report', snippet: '...', tags: ['Q1'] }
];
msg.appendChild(refBlock);
```

---

## u-code-block / u-table-block / u-text-block

These are typically rendered automatically inside `u-marked-block`. They can also be used standalone:

```html
<!-- Standalone code block -->
<u-code-block lang="python" .value=${"print('hello')"}></u-code-block>

<!-- Editable text input (same element, different mode) -->
<u-text-block editable placeholder="Edit me..." .value=${text}></u-text-block>
```
