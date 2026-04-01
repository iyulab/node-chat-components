# u-marked-block

```ts
import '@iyulab/chat-components/dist/components/blocks/UMarkedBlock.js';
```

**Tag:** `u-marked-block`

Renders markdown text to HTML. Supports KaTeX math equations, code syntax highlighting, inline citation tag injection, and special handling for `view-json` and `intent-json` code blocks. Applying an 80ms debounce makes it suitable for LLM streaming.

**Special code fences:**
- `` ```view-json `` → automatically rendered as a `u-view` component
- `` ```intent-json `` → stripped from output (must be parsed separately via `IntentPromptBuilder`)
- All other HTML inside markdown is escaped to prevent XSS

```html
<!-- Basic markdown -->
<u-marked-block value="# Hello\n\nThis is **bold** and `code`."></u-marked-block>

<!-- Math equations -->
<u-marked-block value="Euler's identity: $e^{i\pi} + 1 = 0$"></u-marked-block>

<!-- With citation references -->
<u-marked-block
  .value=${"The Earth orbits the Sun."}
  .refs=${[{
    startIndex: 4,
    endIndex: 9,
    label: '[1]',
    sources: [{ type: 'web', url: 'https://...', title: 'Source' }]
  }]}
></u-marked-block>
```

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `undefined` | Markdown text to render |
| `refs` | `ReferenceCitation[]` | `undefined` | Citation list. `u-ref-tag` elements are automatically inserted at `startIndex`/`endIndex` positions |

## ReferenceCitation Type

```ts
interface ReferenceCitation {
  startIndex: number;    // Start character index in the markdown text
  endIndex: number;      // End character index
  label?: string;        // Display label, e.g. "[1]" or "(Smith, 2023)"
  sources: ReferenceSource[];
}
```
