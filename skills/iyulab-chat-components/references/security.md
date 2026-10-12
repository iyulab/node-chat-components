# Security model

Model output is **untrusted** (prompt injection can put third-party text in any response). What each input
is trusted to contain:

| Input | Treated as | Handling |
|---|---|---|
| `u-marked-block` `value` | untrusted | Raw HTML shown as text · link/image URLs protocol-checked (`javascript:`/`data:`/`vbscript:`/`//host` → `#`) · code fences escaped · table cells same rules |
| `block-json` fences | untrusted | Only registered blocks; only the schema's property names are assigned |
| `refs` | untrusted | Text rendered as text · URLs protocol-checked in `u-ref-tag` and `u-ref-card` · a source `image` passes the image origin policy |
| `u-table-block` cell `text` bound directly | untrusted | Rendered as text; search, sort and downloads use it |
| `u-table-block` cell `html` bound directly | **trusted HTML** | Display only. Sanitize before binding. `block-json` cannot reach it |
| Your custom block | your element's contract | The schema allows names, not content — sanitize HTML-rendered properties inside the element |

Requests: markdown images, `u-images-block` and citation previews (`ReferenceSource.image`) load the `http:`/`https:` URL the model writes as soon as they
render (an image URL can carry data out). When the model reads content you do not control, call
`setAllowedImagePrefixes([location.origin + '/', 'https://cdn.example.com/images/'])` before rendering —
images outside the list are not requested and show their alt text (`Image blocked: …`). Prefixes match the
resolved absolute URL; prefer paths to whole domains (open redirects). `data:image/…` is always shown (no
request). Default: all allowed. Add CSP `img-src` as a second layer.
`u-map-block` (OpenStreetMap iframe) and `u-video-block` (YouTube/Vimeo/direct) embed external content.
`u-ref-card` requests no favicon by default.

## Links

A link in model output must not move the host page away (a desktop shell would load the target in its own window,
next to its bridge). Markdown links open in a new tab with `rel="noopener noreferrer"`; only same-document fragments
(`#…`) follow in place. The accessible name ends with «(opens in a new tab)», as for citations and map captions.

Every link a block renders — markdown and table cells, `u-ref-tag`, `u-ref-card`, `u-map-block` — asks the host first.
A click, middle click or Enter fires a cancelable `link-activate` (`bubbles`, `composed`) from the block, with
`detail: { href, originalEvent }` (`href` is absolute). `preventDefault()` cancels the browser's navigation too, so
the app decides — open in the system browser, route in-app, or refuse:

```ts
chat.addEventListener('link-activate', (e) => {
  e.preventDefault();
  const { href, originalEvent } = e.detail;
  if (new URL(href).origin === location.origin && !originalEvent.ctrlKey && !originalEvent.metaKey) router.navigate(href);
  else shell.openExternal(href);
});
```

Nested blocks (a table inside markdown) fire once per press, from the innermost block. Links on the page around a
block are not the block's and fire nothing. In React the wrappers take `onLinkActivate`.

Do not insert model output with `innerHTML` yourself; route it through `u-marked-block`.
