# ElementPromptBuilder

```ts
import { ElementPromptBuilder } from '@iyulab/chat-components';
import type { ElementSchema } from '@iyulab/chat-components';
```

Singleton utility that registers element schemas and generates LLM system prompt instructions for the `block-json` extra system. No manual parsing is needed — `u-marked-block` automatically renders `block-json` code fences via `u-element-block` (see [../extra-system.md](../extra-system.md)).

For the 4 built-in extras (chart/images/map/video), you usually don't need to touch this API directly — `@iyulab/chat-components/extra` exports a ready-built `prompt` string:

```ts
import { prompt } from '@iyulab/chat-components/extra';

const systemPrompt = `You are a helpful assistant.\n\n${prompt}`;
```

---

## Overview

```ts
const builder = ElementPromptBuilder.instance;

// Register a custom element schema
builder.add({
  tag: 'my-custom-block',
  description: 'Display a custom visualization',
  properties: {
    data: { type: 'array', description: 'Data array' }
  },
  required: ['data']
});

// Inject into LLM system prompt
const instruction = builder.build();
```

When the LLM outputs a `block-json` fence, `u-marked-block` renders it automatically via `u-element-block`:

````
```block-json
{
  "tag": "my-custom-block",
  "properties": { "data": [1, 2, 3] }
}
```
````

---

## API

### `ElementPromptBuilder.instance`

Returns the singleton. Created on first access.

### `.add(schema: ElementSchema): this`

Registers a custom element schema. Throws if the same `tag` is already registered.

```ts
interface ElementSchema {
  tag: string;
  description: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
}
```

### `.build(): string`

Returns LLM system prompt instructions for all registered schemas, injected into the `element-prompt.md` template. Returns an empty string if nothing is registered.
