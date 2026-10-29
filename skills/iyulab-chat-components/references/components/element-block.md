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
| `fence` | `string` | `undefined` | — | A fence language registered with `registerFenceBlock`. When set, the data script is read as that fence's body and assigned to the registered block's one property; a block it cannot build is shown in a code block in that language |

## Error Handling

If `tag` is missing or not a registered block, or `properties` is not an object or fails to assign, `u-element-block` does **not** show an error card — it logs to the console (`[@iyulab/chat-components] u-element-block: ...`). While `loading` is `true` it shows a skeleton and ignores JSON parse failures (incomplete streamed JSON is expected mid-stream). Once `loading` is `false`, a block it could not create — broken JSON, a missing or unregistered `tag`, an element that is not defined — is shown as its raw text in a `u-code-block` with `lang="block-json"`, so the content is never silently dropped.

## Security

`tag` and `properties` usually come from model output, so they are treated as untrusted. Only registered blocks are created, and only the property names in the block's schema are assigned — any other key (for example `style`) is dropped and logged. See [../extra-system.md](../extra-system.md#security).
