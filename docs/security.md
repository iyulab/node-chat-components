# Security model

`@iyulab/chat-components` renders model output. Treat that output as **untrusted input**: a document the
model retrieved, a file the user attached, or a tool result can carry instructions the model follows
(prompt injection), so anything in the response may have been written by a third party. This is the
threat the OWASP Top 10 for LLM Applications calls *Improper Output Handling* (LLM05).

This page lists what the components do with each input, and what is left to your application.

---

## What each input is trusted to contain

| Input | Treated as | What the components do |
|---|---|---|
| `u-marked-block` `value` (markdown) | untrusted | Raw HTML in the markdown is shown as text, not rendered. Link `href` passes a protocol check — `javascript:`, `data:`, `vbscript:` and protocol-relative (`//host`) URLs become `#`. Images pass the same check (`data:image/…` excepted) and then the image origin policy; a blocked image is shown as its alt text. Code fences are escaped. Table cells use the same rules. |
| `block-json` fences in `value` | untrusted | Only **registered blocks** are created, and only the property names in that block's schema are assigned — see [extras-system.md](./extras-system.md#security). Any other tag or key is ignored and logged. |
| `u-marked-block` `refs` | untrusted | Labels, titles and snippets are rendered as text. Source URLs pass the same protocol check in both the inline citation (`u-ref-tag`) and its card (`u-ref-card`). A source's preview `image` passes the image origin policy below, like a markdown image. |
| `u-ref-card` / `u-ref-tag` properties you bind directly | untrusted | Text is rendered as text; `url` / `href` pass the protocol check. |
| `u-table-block` `headers[].text` / `rows[][].text` bound directly | untrusted | Rendered as text; search, sort and the CSV/XLS downloads use it. |
| `u-table-block` `headers[].html` / `rows[][].html` bound directly | **trusted HTML** | Rendered as HTML (display only). `u-marked-block` fills these from its own sanitized renderer; if you bind them yourself, sanitize first. `block-json` cannot reach them. |
| Your own block registered for `block-json` | depends on your element | The schema decides which **names** can be set, not what the **values** contain. If your element renders a property as HTML, sanitize it inside the element. |

## Requests the components make

- **Images in markdown, `u-images-block` and citation previews (`ReferenceSource.image`)** load the `http:`/`https:` URL the model writes as soon as they
  render. A prompt-injected response can use an image URL to send data to a third party (the query string
  is the payload) without the user doing anything. If your model reads content you do not control, limit
  where images may come from:

  ```ts
  import { setAllowedImagePrefixes } from '@iyulab/chat-components';

  setAllowedImagePrefixes([location.origin + '/', 'https://cdn.example.com/images/']);
  ```

  An image outside the list is not requested; its alt text is shown instead (`Image blocked: …`).
  Prefixes are compared with the resolved absolute URL, so relative URLs need your own origin in the list.
  Prefer a path (`https://example.com/images/`) to a whole domain — an open redirect on an allowed domain
  would lead elsewhere. `data:image/…` URLs make no request and are always shown. The default allows every
  image; set the policy before rendering. A Content Security Policy (`img-src`) is the second layer and
  also covers images your own code renders.
- **`u-map-block`** embeds an OpenStreetMap iframe; **`u-video-block`** embeds YouTube or Vimeo, or plays a
  direct video URL. Import these extras only if you allow those destinations (`frame-src`, `media-src`).
- **`u-ref-card`** requests no favicon unless you set `URefCard.defaultFaviconUrl` or a card's
  `faviconUrl`.

## Your application's part

1. Pass model output only through `u-marked-block` (or the other block components); do not insert it with
   `innerHTML` yourself.
2. Do not bind unsanitized strings to a `u-table-block` cell's `html` — put plain text in `text`.
3. Register only blocks that accept data. Keep each schema's `properties` to what the model needs.
4. If the model reads content you do not control, call `setAllowedImagePrefixes()` with the image sources
   you accept.
5. Set a Content Security Policy that matches the extras you import and the image sources you accept.
