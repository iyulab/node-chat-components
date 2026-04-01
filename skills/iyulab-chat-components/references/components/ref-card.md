# u-ref-card

```ts
import '@iyulab/chat-components/dist/components/references/URefCard.js';
```

**Tag:** `u-ref-card`

Displays a single reference source as a card. Supports `web` and `document` types. For web sources, automatically fetches a favicon via the Google Favicon API.

Extends `UDataElement`, so data can also be injected via a `<script type="application/json">` slot.

```html
<!-- Web source -->
<u-ref-card
  type="web"
  url="https://example.com/article"
  title="Article Title"
  snippet="Short content summary..."
  .tags=${["tech", "AI"]}
></u-ref-card>

<!-- Document source -->
<u-ref-card
  type="document"
  title="Internal Document"
  snippet="Document excerpt..."
></u-ref-card>

<!-- JSON slot injection -->
<u-ref-card>
  <script type="application/json">
    { "type": "web", "url": "https://example.com", "title": "Example", "snippet": "Description" }
  </script>
</u-ref-card>
```

---

## Properties

| Property | Type | Default | Reflect | Description |
|----------|------|---------|---------|-------------|
| `type` | `'web'\|'document'` | `'web'` | ✓ | Card type. Determines badge icon |
| `url` | `string` | `undefined` | — | External link URL. Click is suppressed if not set |
| `title` | `string` | `''` | — | Card title (falls back to domain name for web type) |
| `snippet` | `string` | `undefined` | — | Excerpt text |
| `tags` | `string[]` | `undefined` | — | Tag list. Pass as JSON array string via HTML attribute |
