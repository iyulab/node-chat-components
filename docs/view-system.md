# View System

Views allow the LLM to render rich media content — charts, maps, image galleries, videos — directly inside a chat message by outputting a `view-json` fenced code block.

Unlike the intent system, **views are rendered automatically** by `u-marked-block`. No manual parsing is required.

---

## How It Works

1. **Register** view definitions with `ViewPromptBuilder`
2. **Build** and inject the resulting instruction string into your LLM system prompt
3. **Automatic rendering**: `u-marked-block` detects `view-json` blocks and passes them to `u-view`, which creates the appropriate custom element with the specified properties

````
Here is the sales data for Q1:

```view-json
{
  "tag": "u-chart-view",
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

```ts
import { ViewPromptBuilder, PresetView } from '@iyulab/chat-components';

const builder = ViewPromptBuilder.instance;

// Use all presets
builder.use(PresetView.All);

// Or selectively
builder.use(PresetView.Images | PresetView.Chart);

// Attach to system prompt
const systemPrompt = `You are a helpful assistant.\n\n${builder.build()}`;
```

No parse step needed — just render markdown normally:

```ts
markedBlock.value = llmResponse; // views inside are rendered automatically
```

---

## Preset Views

### `u-images-view` — Image Gallery

Carousel with lightbox. Up to 3 slides visible at once; keyboard navigable.

```json
{
  "tag": "u-images-view",
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

### `u-video-view` — Video Player

Auto-detects YouTube, Vimeo, or direct video file from the URL.

```json
{
  "tag": "u-video-view",
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

### `u-chart-view` — Chart

Chart.js chart with PNG/JSON download and automatic dark/light theme sync.

```json
{
  "tag": "u-chart-view",
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

### `u-map-view` — Map

OpenStreetMap embed with marker and label.

```json
{
  "tag": "u-map-view",
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

## Registering Custom Views

You can register any custom element as a view:

```ts
import { ViewPromptBuilder } from '@iyulab/chat-components';
import type { ViewDefinition } from '@iyulab/chat-components';

// Define the custom element
class MyTimelineView extends HTMLElement { /* ... */ }
customElements.define('my-timeline-view', MyTimelineView);

const def: ViewDefinition = {
  element: MyTimelineView,
  tag: 'my-timeline-view',
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

ViewPromptBuilder.instance.add(def);
```

The element just needs to accept standard property assignments — `u-view` binds `properties` keys directly to element properties.

---

## Security

`u-view` maintains a `blacklist` of dangerous property names that are never bound (prevents XSS via `innerHTML`, `outerHTML`, etc.):

```ts
const DEFAULT_BLACKLIST = ['innerHTML', 'outerHTML', 'textContent', 'innerText', 'outerText', 'srcdoc'];
```

Custom elements registered as views should only accept well-typed, data-only properties.

---

## ViewPromptBuilder API

| Method | Description |
|--------|-------------|
| `ViewPromptBuilder.instance` | Singleton accessor |
| `.use(flags: PresetView)` | Register preset views by bit flag |
| `.add(definition: ViewDefinition)` | Register a custom view (throws on tag conflict) |
| `.build(): string` | Generate system prompt instruction string |
