# u-file-block

```ts
import '@iyulab/chat-components/dist/components/blocks/UFileBlock.js';
```

**Tag:** `u-file-block`

Displays a single file as a card. Shows a type-appropriate icon (or an actual thumbnail for image/video files with a `url`), and an optional remove button. There is no download affordance — wire up your own using the `url` property if needed.

Clicking anywhere on the card opens a full-size preview overlay, but only for image/video files that have a `url` set; other file types are not clickable.

```html
<!-- Generic file (icon by MIME type) -->
<u-file-block name="report.xlsx" type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" size=${512000}></u-file-block>

<!-- Image file — renders a thumbnail, click opens full-size preview -->
<u-file-block name="photo.png" type="image/png" size=${102400} url="https://example.com/photo.png"></u-file-block>

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
| `name` | `string` | `undefined` | — | File name |
| `type` | `string` | `undefined` | — | MIME type (determines icon / thumbnail) |
| `size` | `number` | `undefined` | — | File size in bytes; auto-formatted to KB/MB/GB |
| `url` | `string` | `undefined` | — | File URL, used for the image/video thumbnail and preview overlay |

## Events

| Event | Detail | Description |
|-------|--------|--------------|
| `remove` | `RemoveEventDetail` | Fired when the remove button is clicked. If not cancelled, the element removes itself from the DOM |

## Icon Resolution by MIME Type

Only used when `type` doesn't start with `image/` or `video/` (or `url` is unset) — otherwise an actual `<img>`/`<video>` thumbnail is rendered instead.

| MIME | Icon |
|------|------|
| `image/*` | photo |
| `video/*` | video |
| `audio/*` | file-music |
| `application/pdf` | file-type-pdf |
| code types (`application/json`, `text/html`, `text/x-*`, etc.) | file-code |
| spreadsheet types (`.xls`, `.xlsx`, `text/csv`) | file-spreadsheet |
| archive types (`.zip`, `.tar`, `.rar`, `.gz`, `.7z`) | file-zip |
| `text/*` | file-text |
| other | file |
