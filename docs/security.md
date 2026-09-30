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
| `u-marked-block` `value` (markdown) | untrusted | Raw HTML in the markdown is shown as text, not rendered. Link `href` and image `src` pass a protocol check — `javascript:`, `data:`, `vbscript:` and protocol-relative (`//host`) URLs become `#`. Code fences are escaped. Table cells use the same rules. |
| `block-json` fences in `value` | untrusted | Only **registered blocks** are created, and only the property names in that block's schema are assigned — see [extras-system.md](./extras-system.md#security). Any other tag or key is ignored and logged. |
| `u-marked-block` `refs` | untrusted | Labels, titles and snippets are rendered as text. Source URLs pass the same protocol check in both the inline citation (`u-ref-tag`) and its card (`u-ref-card`). |
| `u-ref-card` / `u-ref-tag` properties you bind directly | untrusted | Text is rendered as text; `url` / `href` pass the protocol check. |
| `u-table-block` `headers[].text` / `rows[][].text` bound directly | **trusted HTML** | Rendered as HTML. `u-marked-block` fills these from its own sanitized renderer; if you bind them yourself, sanitize first. `block-json` cannot reach them. |
| Your own block registered for `block-json` | depends on your element | The schema decides which **names** can be set, not what the **values** contain. If your element renders a property as HTML, sanitize it inside the element. |

## Requests the components make

- **Images in markdown and `u-images-block`** load any `http:`/`https:` URL the model writes. A prompt-injected
  response can use an image URL to send data to a third party (the query string is the payload). If your
  model reads content you do not control, restrict image origins with a Content Security Policy
  (`img-src`).
- **`u-map-block`** embeds an OpenStreetMap iframe; **`u-video-block`** embeds YouTube or Vimeo, or plays a
  direct video URL. Import these extras only if you allow those destinations (`frame-src`, `media-src`).
- **`u-ref-card`** requests no favicon unless you set `URefCard.defaultFaviconUrl` or a card's
  `faviconUrl`.

## Your application's part

1. Pass model output only through `u-marked-block` (or the other block components); do not insert it with
   `innerHTML` yourself.
2. Do not bind unsanitized strings to `u-table-block` cell text.
3. Register only blocks that accept data. Keep each schema's `properties` to what the model needs.
4. Set a Content Security Policy that matches the extras you import and the image sources you accept.
