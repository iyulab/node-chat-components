# Security model

Model output is **untrusted** (prompt injection can put third-party text in any response). What each input
is trusted to contain:

| Input | Treated as | Handling |
|---|---|---|
| `u-marked-block` `value` | untrusted | Raw HTML shown as text · link/image URLs protocol-checked (`javascript:`/`data:`/`vbscript:`/`//host` → `#`) · code fences escaped · table cells same rules |
| `block-json` fences | untrusted | Only registered blocks; only the schema's property names are assigned |
| `refs` | untrusted | Text rendered as text · URLs protocol-checked in `u-ref-tag` and `u-ref-card` |
| `u-table-block` cell `text` bound directly | **trusted HTML** | Sanitize before binding. `block-json` cannot reach it |
| Your custom block | your element's contract | The schema allows names, not content — sanitize HTML-rendered properties inside the element |

Requests: markdown images and `u-images-block` load the `http:`/`https:` URL the model writes as soon as they
render (an image URL can carry data out). When the model reads content you do not control, call
`setAllowedImagePrefixes([location.origin + '/', 'https://cdn.example.com/images/'])` before rendering —
images outside the list are not requested and show their alt text (`Image blocked: …`). Prefixes match the
resolved absolute URL; prefer paths to whole domains (open redirects). `data:image/…` is always shown (no
request). Default: all allowed. Add CSP `img-src` as a second layer.
`u-map-block` (OpenStreetMap iframe) and `u-video-block` (YouTube/Vimeo/direct) embed external content.
`u-ref-card` requests no favicon by default.

Do not insert model output with `innerHTML` yourself; route it through `u-marked-block`.
