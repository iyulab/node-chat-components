# Extra System

Extras let the LLM render rich media content — charts, maps, image galleries, videos — directly inside a chat message by outputting a `block-json` fenced code block. **Extras are rendered automatically** by `u-marked-block`; no manual parsing is required.

## How It Works

1. **Register** extra schemas with `ElementPromptBuilder` (or just import the built-in `prompt`)
2. **Inject** the resulting instruction string into your LLM system prompt
3. **Automatic rendering**: `u-marked-block` detects `block-json` fences and passes them to [`u-element-block`](./components/element-block.md), which creates the appropriate custom element with the specified properties

````
```block-json
{
  "tag": "u-chart-block",
  "properties": {
    "type": "bar",
    "data": { "labels": ["Jan", "Feb", "Mar"], "datasets": [{ "label": "Revenue ($k)", "data": [120, 98, 145] }] }
  }
}
```
````

## Setup

The 4 built-in extras (chart/images/map/video) are not part of the core package — import `@iyulab/chat-components/extra` to register all of them at once and get a ready-built prompt fragment:

```ts
import '@iyulab/chat-components';
import { prompt } from '@iyulab/chat-components/extra';

const systemPrompt = `You are a helpful assistant.\n\n${prompt}`;
```

`prompt` is built once at import time from the 4 built-in schemas. Registering additional custom extras via `ElementPromptBuilder.instance.add(...)`? Call `ElementPromptBuilder.instance.build()` again to get a fragment that includes both the built-ins and your custom extras.

Need only one or two of the built-ins (e.g. to skip bundling `chart.js`)? Import the specific component directly instead of the bulk `/extra` entry:

```ts
import '@iyulab/chat-components/dist/components-extra/UImagesBlock.js';
```

## Built-in Extras

| Tag | Doc |
|-----|-----|
| `u-images-block` | [components/images-block.md](./components/images-block.md) |
| `u-video-block` | [components/video-block.md](./components/video-block.md) |
| `u-chart-block` | [components/chart-block.md](./components/chart-block.md) |
| `u-map-block` | [components/map-block.md](./components/map-block.md) |

## Registering Custom Extras

```ts
import { ElementPromptBuilder } from '@iyulab/chat-components';
import type { ElementSchema } from '@iyulab/chat-components';

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

The element just needs to accept standard property assignments. `add()` also registers the schema as a renderable block — `u-element-block` assigns only the names in the schema's `properties`. If you write your own prompt instead, call `registerElementBlock(def)` (exported from `@iyulab/chat-components`).

## Blocks whose content is one text — their own fence

Some blocks take a single piece of text rather than several fields: a diagram language, a formula, a code-like spec.
Through `block-json` the model would have to put that text inside a JSON string and escape every newline and quote.
Register a fence language for such a block instead — the fence body goes into one property as it is:

```ts
import { ElementPromptBuilder, registerFenceBlock } from '@iyulab/chat-components';

ElementPromptBuilder.instance.addFence({
  lang: 'diagram',          // the fence language the model writes
  tag: 'x-diagram-block',   // a defined custom element
  property: 'spec',         // receives the fence body
  as: 'text',               // 'text' (default) assigns the body as a string; 'json' parses it first
  description: 'Draws a flow diagram from its declaration.',
  example: 'kind = "flow"',
});

// or, when you write the prompt yourself:
registerFenceBlock({ lang: 'diagram', tag: 'x-diagram-block', property: 'spec' });
```

Only registered languages become blocks — any other fence is still a code block — and only the registered property is
assigned. While the message streams the block shows a skeleton; if it cannot be built once the stream has ended, the
fence body is shown as a code block in that language. `block-json` itself cannot be registered as a fence language.

## Error Handling

If the LLM outputs a `tag` that isn't a registered block (e.g. missing `@iyulab/chat-components/extra` import, or a custom extra's schema was never registered or its element isn't defined yet), `u-element-block` does **not** show an error card — it logs to the console and, once streaming has ended, shows the fence's raw text as a `block-json` code block instead. Genuine data errors (invalid `properties`, assignment failures) are also console-only.

## Security

`block-json` is model output and is treated as untrusted. `u-element-block` creates only registered blocks (`ElementPromptBuilder.add()` or `registerElementBlock()`; built-in extras register on import; fence languages from `addFence()` or `registerFenceBlock()`) and assigns only the property names in the block's schema `properties` — other keys, including `style`, are dropped and logged. Custom extras should accept data only; if a property is rendered as HTML, sanitize it inside the element.

## `ElementPromptBuilder` API

| Method | Description |
|--------|-------------|
| `ElementPromptBuilder.instance` | Singleton accessor |
| `.add(definition: ElementSchema)` | Register a custom extra (throws on tag conflict). Also registers it as a renderable block |
| `.addFence(fence: FenceBlockSchema)` | Map a fence language to one property of a block and describe it in the prompt (throws on language conflict) |
| `.build(): string` | Generate system prompt instruction string |
