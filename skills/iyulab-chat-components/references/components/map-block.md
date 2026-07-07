# u-map-block

```ts
import '@iyulab/chat-components/dist/components-extra/UMapBlock.js';
```

**Tag:** `u-map-block` — one of the 4 built-in **extra** blocks. Not part of the core entrypoint; import it (or the whole `/extra` subpath) explicitly. See [../extra-system.md](../extra-system.md).

Embeds an OpenStreetMap iframe centered on a given coordinate. A marker is placed at the specified `lat`/`lng` position.

```html
<!-- Basic map -->
<u-map-block lat="37.5665" lng="126.9780"></u-map-block>

<!-- With label, description, and zoom -->
<u-map-block
  lat="37.5665"
  lng="126.9780"
  zoom="13"
  label="Seoul City Hall"
  description="110 Sejong-daero, Jung-gu, Seoul"
></u-map-block>
```

LLM output example (`block-json` code fence, rendered via `u-element-block`):

````
```block-json
{
  "tag": "u-map-block",
  "properties": {
    "lat": 37.5665,
    "lng": 126.9780,
    "zoom": 15,
    "label": "Seoul City Hall",
    "description": "Jung-gu, Seoul"
  }
}
```
````

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `lat` | `number` | `undefined` | Latitude (required) |
| `lng` | `number` | `undefined` | Longitude (required) |
| `zoom` | `number` | `15` | Zoom level (1–19) |
| `label` | `string` | `undefined` | Bold label shown below the map |
| `description` | `string` | `undefined` | Description shown below the label |

Renders nothing if either `lat` or `lng` is missing.
