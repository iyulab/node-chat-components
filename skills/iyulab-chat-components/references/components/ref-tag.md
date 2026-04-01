# u-ref-tag

```ts
import '@iyulab/chat-components/dist/components/references/URefTag.js';
```

**Tag:** `u-ref-tag`

Inline citation tag inserted within markdown body text. Opens an external link on click and shows source details in a tooltip.

Typically inserted automatically by `u-marked-block` when `refs` data is provided.

```html
<!-- Inline citation -->
<u-ref-tag href="https://example.com">
  [1]
  <div slot="tooltip">Example Domain — source description...</div>
</u-ref-tag>

<!-- No href (local document) -->
<u-ref-tag>
  [2]
  <div slot="tooltip">Internal document title</div>
</u-ref-tag>
```

---

## Slots

| Name | Description |
|------|-------------|
| *(default)* | Citation label text (e.g. `[1]`, `(Smith, 2023)`) |
| `tooltip` | Tooltip content (source details) |

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `href` | `string` | `undefined` | External link URL. Click is suppressed if not set |
