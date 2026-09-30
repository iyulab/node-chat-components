# u-element-block

```ts
import '@iyulab/chat-components/dist/components/blocks/UElementBlock.js';
```

**Tag:** `u-element-block`

Dynamic block renderer. Creates the registered block specified by `tag`, binds the schema's `properties` to it, and shows a skeleton placeholder while `loading`. Used internally by `u-marked-block` to render `block-json` code fences (see [../extra-system.md](../extra-system.md)) — you generally don't create it directly.

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
| `tag` | `string` | `undefined` | — | Block tag to render. Must be a registered block (`registerElementBlock` or `ElementPromptBuilder.add`) whose element is defined |
| `properties` | `Record<string, unknown>` | `undefined` | — | Values to bind. Only names listed in the block schema's `properties` are assigned |
| `loading` | `boolean` | `false` | ✓ | Shows a skeleton placeholder instead of the element |

## Error Handling

If `tag` is missing or not a registered block, or `properties` is not an object or fails to assign, `u-element-block` does **not** show an error card — it renders nothing and logs to the console (`[u-element-block] ...`). While `loading` is `true`, JSON parse failures from the underlying `UDataElement` are silently ignored too, since incomplete streamed JSON is expected mid-stream.

## Security

`tag` and `properties` usually come from model output, so they are treated as untrusted. Only registered blocks are created, and only the property names in the block's schema are assigned — any other key (for example `style`) is dropped and logged. See [../extra-system.md](../extra-system.md#security).
