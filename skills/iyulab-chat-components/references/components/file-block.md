# u-file-block

```ts
import '@iyulab/chat-components/dist/components/blocks/UFileBlock.js';
```

**Tag:** `u-file-block`

Displays a single file as a card. Shows a type-appropriate icon, upload status, download link, and an optional remove button.

```html
<!-- Image file -->
<u-file-block name="photo.png" type="image/png" size=${102400}></u-file-block>

<!-- Uploading state -->
<u-file-block name="document.pdf" type="application/pdf" status="uploading"></u-file-block>

<!-- With download link -->
<u-file-block
  name="report.xlsx"
  type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  size=${512000}
  url="https://example.com/report.xlsx"
></u-file-block>

<!-- Removable (e.g. prompt attachment) -->
<u-file-block
  removable
  name="image.jpg"
  type="image/jpeg"
  @remove=${handleRemove}
></u-file-block>
```

---

## Properties

| Property | Type | Default | Reflect | Description |
|----------|------|---------|---------|-------------|
| `removable` | `boolean` | `false` | ✓ | Shows the remove button |
| `status` | `'idle'\|'uploading'\|'error'` | `undefined` | ✓ | File state. `uploading` shows spinner; `error` shows error icon |
| `name` | `string` | `undefined` | — | File name |
| `type` | `string` | `undefined` | — | MIME type (determines icon) |
| `size` | `number` | `undefined` | — | File size in bytes; auto-formatted to KB/MB |
| `url` | `string` | `undefined` | — | Download URL. Shows download button when set |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `remove` | `RemoveEventDetail` | Fired when the remove button is clicked. If not cancelled, the element removes itself from the DOM |

## Icon Resolution by MIME Type

| MIME | Icon |
|------|------|
| `image/*` | `file-earmark-image` |
| `video/*` | `file-earmark-play` |
| `audio/*` | `file-earmark-music` |
| `application/pdf` | `file-earmark-pdf` |
| `application/zip` | `file-earmark-zip` |
| `text/*` | `file-earmark-text` |
| other | `file-earmark` |
