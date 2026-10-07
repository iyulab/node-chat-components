# u-ref-card

```ts
import '@iyulab/chat-components/dist/components/references/URefCard.js';
```

**Tag:** `u-ref-card`

Displays a single reference source as a card. Supports `web` and `document` types. A web card shows a favicon only when you give it a resolver — by default it makes no request of its own (see [Favicon](#favicon)).

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
| `faviconUrl` | `FaviconResolver` | `undefined` | — | Favicon resolver for this card (property only). Overrides `URefCard.defaultFaviconUrl` |
| `image` | `ReferenceImage` | `undefined` | — | Preview image (`{ src, alt? }`), drawn above the snippet. Passes the image origin policy (`setAllowedImagePrefixes`); a blocked image makes no request and shows its alt text as *Image blocked* |

## CSS Parts

| Part | Description |
|------|-------------|
| `preview` | The source's preview image (`image`) |
| `preview-blocked` | The *Image blocked* line where the origin policy stopped the preview |

---

## Favicon

```ts
import { URefCard, googleFaviconUrl } from '@iyulab/chat-components';

// type FaviconResolver = (url: string) => string | undefined
URefCard.defaultFaviconUrl = (url) => `/favicons/${new URL(url).hostname}.png`; // your own host
// or, where the public internet is reachable and sending host names to Google is acceptable:
URefCard.defaultFaviconUrl = googleFaviconUrl;
```

- **Default: no favicon, no request.** The card never contacts a third party unless you choose one — safe on a closed network.
- `URefCard.defaultFaviconUrl` applies to every card, including those rendered inside `u-ref-block`, `u-ref-card-group` and marked-block tooltips. Set it before cards render.
- A card's own `faviconUrl` property wins over the module-wide one. Returning `undefined` draws the card without a favicon.
- `googleFaviconUrl` sends each card's host name (not the full URL) to `www.google.com`.
