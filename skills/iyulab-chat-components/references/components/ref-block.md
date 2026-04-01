# u-ref-block

```ts
import '@iyulab/chat-components/dist/components/blocks/URefBlock.js';
```

**Tag:** `u-ref-block`

Displays a group of reference sources as a collapsible block with a `u-ref-card` grid layout.

```html
<!-- Basic usage -->
<u-ref-block
  title="References"
  .sources=${[
    { type: 'web', url: 'https://example.com', title: 'Example Page', snippet: 'Summary...' },
    { type: 'document', title: 'Internal Report', snippet: 'Excerpt...', tags: ['report'] }
  ]}
></u-ref-block>

<!-- Expanded by default -->
<u-ref-block .collapsed=${false} .sources=${sources}></u-ref-block>
```

---

## Properties

| Property | Type | Default | Reflect | Description |
|----------|------|---------|---------|-------------|
| `title` | `string` | `''` | — | Header title (falls back to 'References') |
| `collapsed` | `boolean` | `true` | ✓ | Collapsed state. Toggle by clicking the header |
| `sources` | `ReferenceSource[]` | `undefined` | — | List of reference sources |

## ReferenceSource Type

```ts
interface ReferenceSource {
  type: 'web' | 'document';
  url?: string;       // Link URL
  title?: string;     // Card title
  snippet?: string;   // Excerpt text
  tags?: string[];    // Tag list
}
```
