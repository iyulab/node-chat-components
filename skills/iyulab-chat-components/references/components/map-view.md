# u-map-view

```ts
import '@iyulab/chat-components/dist/components/views/UMapView.js';
```

**Tag:** `u-map-view`

Embeds an OpenStreetMap iframe centered on a given coordinate. A marker is placed at the specified `lat`/`lng` position.

```html
<!-- Basic map -->
<u-map-view lat="37.5665" lng="126.9780"></u-map-view>

<!-- With label, description, and zoom -->
<u-map-view
  lat="37.5665"
  lng="126.9780"
  zoom="13"
  label="Seoul City Hall"
  description="110 Sejong-daero, Jung-gu, Seoul"
></u-map-view>
```

LLM output example (`view-json` code block):

````
```view-json
{
  "tag": "u-map-view",
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
