# Extras System

Extras let the LLM render rich media content — charts, maps, image galleries, videos — directly inside a chat message by outputting a `block-json` fenced code block.

**Extras are rendered automatically** by `u-marked-block`. No manual parsing is required.

---

## How It Works

1. **Register** extra definitions with `ElementPromptBuilder`
2. **Build** and inject the resulting instruction string into your LLM system prompt
3. **Automatic rendering**: `u-marked-block` detects `block-json` blocks and passes them to `u-element-block`, which creates the appropriate custom element with the specified properties

````
Here is the sales data for Q1:

```block-json
{
  "tag": "u-chart-block",
  "properties": {
    "type": "bar",
    "data": {
      "labels": ["Jan", "Feb", "Mar"],
      "datasets": [{ "label": "Revenue ($k)", "data": [120, 98, 145] }]
    }
  }
}
```
````

---

## Setup

The 4 built-in extras (chart/images/map/video) are not part of the core package — import `@iyulab/chat-components/extra` to register all of them at once and get a ready-built prompt fragment:

```ts
import '@iyulab/chat-components';
import { prompt } from '@iyulab/chat-components/extra';

// Attach to system prompt
const systemPrompt = `You are a helpful assistant.\n\n${prompt}`;
```

`prompt` is built once at import time from the 4 built-in schemas (`u-images-block`, `u-video-block`, `u-map-block`, `u-chart-block`). If you register additional custom extras via `ElementPromptBuilder.instance.add(...)`, call `ElementPromptBuilder.instance.build()` again to get a prompt fragment that includes both the built-ins and your custom extras.

No parse step needed — just render markdown normally:

```ts
markedBlock.value = llmResponse; // extras inside are rendered automatically
```

If you only need one or two of the built-ins and want to avoid bundling the rest (e.g. skip `chart.js` entirely), import the specific component directly instead of the bulk `/extra` entry:

```ts
import '@iyulab/chat-components/dist/components-extra/UImagesBlock.js';
```

---

## Preset Extras

### `u-images-block` — Image Gallery

Carousel with lightbox. Up to 3 slides visible at once; keyboard navigable.

```json
{
  "tag": "u-images-block",
  "properties": {
    "items": [
      { "src": "https://example.com/photo.jpg", "alt": "Description", "caption": "Caption" }
    ]
  }
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `items` | `{ src, alt?, caption? }[]` | ✓ | Image array |

---

### `u-video-block` — Video Player

Auto-detects YouTube, Vimeo, or direct video file from the URL.

```json
{
  "tag": "u-video-block",
  "properties": {
    "src": "https://www.youtube.com/watch?v=VIDEO_ID"
  }
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `src` | `string` | ✓ | YouTube, Vimeo, or direct video URL |
| `poster` | `string` | — | Poster image for direct files |
| `ratio` | `'16:9'\|'4:3'\|'1:1'` | — | Aspect ratio (default: `'16:9'`) |

---

### `u-chart-block` — Chart

Chart.js chart with PNG/JSON download and automatic dark/light theme sync.

```json
{
  "tag": "u-chart-block",
  "properties": {
    "type": "line",
    "data": {
      "labels": ["Mon", "Tue", "Wed"],
      "datasets": [{ "label": "Users", "data": [100, 130, 120] }]
    },
    "options": { "plugins": { "legend": { "position": "bottom" } } }
  }
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `ChartType` | ✓ | `'bar'`, `'line'`, `'pie'`, `'doughnut'`, `'radar'`, etc. |
| `data` | `ChartData` | ✓ | Chart.js data object |
| `options` | `ChartOptions` | — | Chart.js options |

---

### `u-map-block` — Map

OpenStreetMap embed with marker and label.

```json
{
  "tag": "u-map-block",
  "properties": {
    "lat": 37.5665, "lng": 126.9780,
    "zoom": 14,
    "label": "Seoul City Hall",
    "description": "Jung-gu, Seoul"
  }
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `lat` | `number` | ✓ | Latitude |
| `lng` | `number` | ✓ | Longitude |
| `zoom` | `number` | — | Zoom level 1–19 (default: `15`) |
| `label` | `string` | — | Marker label |
| `description` | `string` | — | Marker description |

---

## Registering Custom Extras

You can register any custom element as an extra — just define it and register its schema:

```ts
import { ElementPromptBuilder } from '@iyulab/chat-components';
import type { ElementSchema } from '@iyulab/chat-components';

// Define and register the custom element yourself
class MyTimelineBlock extends HTMLElement { /* ... */ }
customElements.define('my-timeline-block', MyTimelineBlock);

const def: ElementSchema = {
  tag: 'my-timeline-block',
  description: 'Display a sequence of events on a timeline',
  properties: {
    events: {
      type: 'array',
      items: { type: 'object', properties: {
        date:  { type: 'string', description: 'ISO date string' },
        title: { type: 'string', description: 'Event title' },
      }, required: ['date', 'title'] },
      description: 'Array of timeline events',
    }
  },
  required: ['events'],
};

ElementPromptBuilder.instance.add(def);
```

The element just needs to accept standard property assignments — `u-element-block` binds `properties` keys directly to element properties.

---

## Error Handling

If the LLM outputs a `tag` that isn't registered (e.g. you forgot to import `@iyulab/chat-components/extra`, or a custom extra's element isn't defined yet), `u-element-block` does **not** show an error card — it renders nothing and logs a warning to the console instead. This avoids surprising error UI in the chat when an extra simply hasn't been wired up yet; check the console during development.

Genuine data errors (invalid `properties`, assignment failures) are also console-only for the same reason.

---

## Security

`u-element-block` maintains a `blacklist` of dangerous property names that are never bound (prevents XSS via `innerHTML`, `outerHTML`, etc.):

```ts
const DEFAULT_BLACKLIST = ['innerHTML', 'outerHTML', 'textContent', 'innerText', 'outerText', 'srcdoc'];
```

Custom elements registered as extras should only accept well-typed, data-only properties.

---

## ElementPromptBuilder API

| Method | Description |
|--------|-------------|
| `ElementPromptBuilder.instance` | Singleton accessor |
| `.add(definition: ElementSchema)` | Register a custom extra (throws on tag conflict) |
| `.build(): string` | Generate system prompt instruction string |
