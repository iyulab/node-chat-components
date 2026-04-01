# Intent System

Intents allow the LLM to output structured interactive UI elements — such as a question with clickable choices — by embedding a JSON block in its response.

---

## How It Works

1. **Register** intent definitions with `IntentPromptBuilder`
2. **Build** and inject the resulting instruction string into your LLM system prompt
3. **Parse** the LLM response to extract `intent-json` blocks
4. **Render** the appropriate intent components from the extracted data

The LLM outputs intent-json as a fenced code block within its regular markdown response:

````
Here are some options to consider:

```intent-json
{
  "type": "question",
  "properties": {
    "question": "Which feature would you like to explore?",
    "choices": ["Authentication", "Database", "Deployment"]
  }
}
```
````

`u-marked-block` silently strips these blocks — they are not rendered as code. Your application must parse and render them manually.

---

## Setup

```ts
import { IntentPromptBuilder, PresetIntent } from '@iyulab/chat-components';

const builder = IntentPromptBuilder.instance;

// Use preset(s)
builder.use(PresetIntent.Questions);

// Or combine
builder.use(PresetIntent.All);

// Add custom intent types
builder.add({
  type: 'confirm',
  description: 'Ask the user to confirm or cancel an action',
  properties: {
    message: { type: 'string', description: 'Confirmation message' },
  },
  required: ['message'],
});

// Attach to system prompt
const systemPrompt = `You are a helpful assistant.\n\n${builder.build()}`;
```

---

## Parsing and Rendering

```ts
import { IntentPromptBuilder } from '@iyulab/chat-components';

const [cleanText, intents] = IntentPromptBuilder.instance.parse(llmResponse);

// cleanText → markdown with intent-json blocks removed
// intents   → IntentSchema[] with { type, properties }

// Render markdown
markedBlock.value = cleanText;

// Render each intent
for (const intent of intents) {
  switch (intent.type) {
    case 'question': {
      const el = document.createElement('u-question-intent') as any;
      el.question = intent.properties?.question;
      el.choices  = intent.properties?.choices ?? [];
      el.addEventListener('choice', (e: any) => {
        prompt.value = e.detail.value;
        prompt.submit();
      });
      msg.appendChild(el);
      break;
    }
    case 'confirm': {
      // render your custom confirm UI
      break;
    }
  }
}
```

---

## Preset Intents

### `PresetIntent.Questions`

Presents a question with up to 5 clickable choice buttons.

**Component:** `u-question-intent`  
**Event:** `choice` → `{ value: string }`

```json
{
  "type": "question",
  "properties": {
    "question": "What would you like to do?",
    "choices": ["Option A", "Option B", "Option C"]
  }
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `choices` | ✓ | Array of 1–5 choice strings |
| `question` | — | Optional question text above choices |

---

## Defining Custom Intents

```ts
import type { IntentDefinition } from '@iyulab/chat-components';

const ratingIntent: IntentDefinition = {
  type: 'rating',
  description: 'Ask the user to rate something on a numeric scale',
  properties: {
    label: { type: 'string', description: 'What to rate (e.g. "the response")' },
    max:   { type: 'number', description: 'Maximum score, default 5' },
  },
  required: ['label'],
};

IntentPromptBuilder.instance.add(ratingIntent);
```

Then handle `type === 'rating'` in your parse loop and render your own component.

---

## IntentPromptBuilder API

| Method | Description |
|--------|-------------|
| `IntentPromptBuilder.instance` | Singleton accessor |
| `.use(flags: PresetIntent)` | Register preset intents by bit flag |
| `.add(definition: IntentDefinition)` | Register a custom intent (throws on duplicate type) |
| `.build(): string` | Generate system prompt instruction string |
| `.parse(text: string): [string, IntentSchema[]]` | Extract intent-json blocks from LLM response |
