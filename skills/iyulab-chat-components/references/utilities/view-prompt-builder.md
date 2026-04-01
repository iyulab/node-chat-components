# ViewPromptBuilder

```ts
import { ViewPromptBuilder, PresetView } from '@iyulab/chat-components';
```

Singleton utility that registers views and generates LLM system prompt instructions. No manual parsing is needed — `u-marked-block` automatically renders `view-json` code blocks via `u-view`.

---

## Overview

```ts
import { ViewPromptBuilder, PresetView } from '@iyulab/chat-components';

const builder = ViewPromptBuilder.instance;

// 1. Register preset views
builder.use(PresetView.All);
// Or selectively
builder.use(PresetView.Images | PresetView.Chart);

// 2. Register a custom view
builder.add({
  element: MyCustomView,    // CustomElementConstructor
  tag: 'my-custom-view',
  description: 'Display a custom visualization',
  properties: {
    data: { type: 'array', description: 'Data array' }
  },
  required: ['data']
});

// 3. Inject into LLM system prompt
const instruction = builder.build();
```

When the LLM outputs a `view-json` block, `u-marked-block` renders it automatically:

````
```view-json
{
  "tag": "u-chart-view",
  "properties": {
    "type": "pie",
    "data": {
      "labels": ["A", "B", "C"],
      "datasets": [{ "data": [30, 50, 20] }]
    }
  }
}
```
````

---

## API

### `ViewPromptBuilder.instance`

Returns the singleton. Created on first access.

### `.use(flags: PresetView): this`

Registers preset views by bit flag.

```ts
builder.use(PresetView.Images);
builder.use(PresetView.All);
builder.use(PresetView.Images | PresetView.Chart);
```

### `.add(definition: ViewDefinition): this`

Registers a custom view and its custom element. Throws if the same `tag` is already registered or if the tag is already defined with a different class.

```ts
interface ViewDefinition {
  element: CustomElementConstructor;
  tag: string;
  description: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
}
```

### `.build(): string`

Returns LLM system prompt instructions for all registered views. Returns an empty string if no views are registered.

---

## PresetView Flags

```ts
enum PresetView {
  Images = 1 << 0,   // u-images-view
  Video  = 1 << 1,   // u-video-view
  Map    = 1 << 3,   // u-map-view
  Chart  = 1 << 4,   // u-chart-view
  All    = Images | Video | Map | Chart
}
```

### Preset View Schema Summary

| Tag | Key Properties |
|-----|----------------|
| `u-images-view` | `items: [{ src, alt?, caption? }]` |
| `u-video-view`  | `src`, `poster?`, `ratio?` |
| `u-map-view`    | `lat`, `lng`, `zoom?`, `label?`, `description?` |
| `u-chart-view`  | `type`, `data`, `options?` |
