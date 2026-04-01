# u-view

```ts
import '@iyulab/chat-components/dist/components/views/UView.js';
```

**Tag:** `u-view`

Dynamic custom element renderer. Creates the element specified by `tag`, binds `properties` to it, and handles loading and error states. Used internally by `u-marked-block` to render `view-json` code blocks.

```html
<!-- Render u-chart-view dynamically -->
<u-view
  tag="u-chart-view"
  .properties=${{
    type: 'bar',
    data: { labels: ['A', 'B'], datasets: [{ data: [10, 20] }] }
  }}
></u-view>

<!-- Loading state (skeleton placeholder) -->
<u-view tag="u-chart-view" loading></u-view>
```

How `u-marked-block` processes a `view-json` block:

````
```view-json
{
  "tag": "u-images-view",
  "properties": { "items": [{ "src": "https://..." }] }
}
```
````

This is converted to `<u-view tag="u-images-view" ...>` via `UView.buildHTML()`.

---

## Properties

| Property | Type | Default | Reflect | Description |
|----------|------|---------|---------|-------------|
| `tag` | `string` | `undefined` | — | Custom element tag to render. Must already be registered |
| `properties` | `Record<string, unknown>` | `undefined` | — | Properties to bind to the rendered element |
| `loading` | `boolean` | `false` | ✓ | Shows a skeleton placeholder instead of the element |
| `blacklist` | `string[]` | `['innerHTML', 'outerHTML', ...]` | — | Property names blocked from binding for XSS prevention |

## Security

The following property names are blocked by default to prevent XSS: `innerHTML`, `outerHTML`, `textContent`, `innerText`, `outerText`, `srcdoc`. Extend `blacklist` to add more restrictions.
