# IntentPromptBuilder

```ts
import { IntentPromptBuilder, PresetIntent } from '@iyulab/chat-components';
```

Singleton utility that registers intents, generates LLM system prompt instructions, and parses `intent-json` blocks from LLM responses.

---

## Overview

```ts
import { IntentPromptBuilder, PresetIntent } from '@iyulab/chat-components';

const builder = IntentPromptBuilder.instance;

// 1. Register preset intents
builder.use(PresetIntent.Questions);

// 2. Register custom intents
builder.add({
  type: 'rating',
  description: 'Prompt the user to rate something on a scale',
  properties: {
    label: { type: 'string', description: 'What to rate' },
    max:   { type: 'number', description: 'Maximum score (default: 5)' }
  },
  required: ['label']
});

// 3. Inject into LLM system prompt
const instruction = builder.build();

// 4. Parse LLM response
const [cleanText, intents] = builder.parse(llmResponse);
// cleanText → markdown with intent-json blocks removed
// intents   → parsed IntentSchema[]

// 5. Render components
for (const intent of intents) {
  if (intent.type === 'question') {
    const el = document.createElement('u-question-intent');
    el.question = intent.properties?.question as string;
    el.choices  = intent.properties?.choices as string[] ?? [];
    container.appendChild(el);
  }
}

markedBlock.value = cleanText;
```

---

## API

### `IntentPromptBuilder.instance`

Returns the singleton. Created on first access.

### `.use(flags: PresetIntent): this`

Registers preset intents by bit flag.

```ts
builder.use(PresetIntent.Questions);
builder.use(PresetIntent.All);
```

### `.add(definition: IntentDefinition): this`

Registers a custom intent. Throws if the same `type` is already registered.

```ts
interface IntentDefinition {
  type: string;
  description: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
}
```

### `.build(): string`

Returns LLM system prompt instructions for all registered intents. Returns an empty string if no intents are registered.

### `.parse(value: string): [string, IntentSchema[]]`

Extracts `intent-json` blocks from an LLM response string.

- Index `[0]` — clean markdown text with intent-json blocks removed
- Index `[1]` — array of parsed `IntentSchema` objects

```ts
interface IntentSchema {
  type: string;
  properties?: Record<string, unknown>;
}
```

---

## PresetIntent Flags

```ts
enum PresetIntent {
  Questions = 1 << 0,
  All       = Questions
}
```

### Questions Intent Schema

```json
{
  "type": "question",
  "properties": {
    "question": { "type": "string" },
    "choices":  { "type": "array", "items": { "type": "string" }, "minItems": 1, "maxItems": 5 }
  },
  "required": ["choices"]
}
```
