# u-element-block

```ts
import '@iyulab/chat-components/dist/components/blocks/UElementBlock.js';
```

**Tag:** `u-element-block`

Dynamic custom element renderer. Creates the element specified by `tag`, binds `properties` to it, and shows a skeleton placeholder while `loading`. Used internally by `u-marked-block` to render `block-json` code fences (see [../extra-system.md](../extra-system.md)) — you generally don't create it directly.

Extends `UDataElement`, so `tag`/`properties` can also be injected via a `<script type="application/json">` slot.

```html
<!-- Render u-chart-block dynamically -->
<u-element-block
  tag="u-chart-block"
  .properties=${{
    type: 'bar',
    data: { labels: ['A', 'B'], datasets: [{ data: [10, 20] }] }
  }}
></u-element-block>

<!-- Loading state (skeleton placeholder) -->
<u-element-block tag="u-chart-block" loading></u-element-block>
```

How `u-marked-block` processes a `block-json` fence:

````
```block-json
{
  "tag": "u-images-block",
  "properties": { "items": [{ "src": "https://..." }] }
}
```
````

This is converted to `<u-element-block tag="u-images-block" ...>` via `UElementBlock.buildHTML()`.

---

## Properties

| Property | Type | Default | Reflect | Description |
|----------|------|---------|---------|-------------|
| `tag` | `string` | `undefined` | — | Custom element tag to render. Must already be registered |
| `properties` | `Record<string, unknown>` | `undefined` | — | Properties to bind to the rendered element |
| `loading` | `boolean` | `false` | ✓ | Shows a skeleton placeholder instead of the element |
| `blacklist` | `string[]` | `['innerHTML', 'outerHTML', 'textContent', 'innerText', 'outerText', 'srcdoc']` | — | Property names blocked from binding for XSS prevention |

## Error Handling

If `tag` is missing, unregistered, or `properties` fails validation/assignment, `u-element-block` does **not** show an error card — it renders nothing and logs to the console (`[u-element-block] ...`). While `loading` is `true`, JSON parse failures from the underlying `UDataElement` are silently ignored too, since incomplete streamed JSON is expected mid-stream.

## Security

The following property names are blocked by default to prevent XSS: `innerHTML`, `outerHTML`, `textContent`, `innerText`, `outerText`, `srcdoc`. Extend `blacklist` to add more restrictions.
