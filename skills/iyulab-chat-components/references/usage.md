# Usage Guide

## Installation

```bash
npm install @iyulab/chat-components
```

---

## Importing Components

### All at once

```ts
import '@iyulab/chat-components';
```

### Individual (tree-shakable)

```ts
import '@iyulab/chat-components/dist/components/message/UMessage.js';
import '@iyulab/chat-components/dist/components/prompt/UPrompt.js';
import '@iyulab/chat-components/dist/components/blocks/UMarkedBlock.js';
```

### Types only

```ts
import type { BlockItem, ReferenceSource } from '@iyulab/chat-components';
import { PresetIntent, PresetView } from '@iyulab/chat-components';
```

---

## Basic Chat UI

Minimal setup connecting a message list and input prompt:

```html
<div id="chat-container">
  <div id="messages"></div>
  <u-prompt id="prompt" placeholder="Type a message..."></u-prompt>
</div>
```

```ts
import '@iyulab/chat-components';

const prompt = document.getElementById('prompt');
const messages = document.getElementById('messages');

// Handle send event
prompt.addEventListener('send', () => {
  const value = prompt.value;
  if (!value) return;

  // Add user message
  const userMsg = document.createElement('u-message');
  userMsg.position = 'right';
  userMsg.innerHTML = `<u-text-block .value="${value}"></u-text-block>`;
  messages.appendChild(userMsg);
  prompt.value = '';

  // Add AI response (loading)
  const aiMsg = document.createElement('u-message');
  aiMsg.loading = true;
  messages.appendChild(aiMsg);

  // Handle LLM streaming...
});

// Handle file attachments
prompt.addEventListener('attach', (e) => {
  const { files } = e.detail;
  prompt.files = files.map(f => ({
    type: 'file',
    name: f.name,
    size: f.size,
    mimeType: f.type,
    status: 'idle',
  }));
});
```

---

## Rendering Markdown Responses

Stream LLM responses as markdown:

```html
<u-message>
  <u-marked-block
    .value=${"# Hello\n\nThis is **markdown** with `code`."}
  ></u-marked-block>
</u-message>
```

With citation references:

```ts
import type { ReferenceCitation } from '@iyulab/chat-components';

const refs: ReferenceCitation[] = [
  {
    startIndex: 10,
    endIndex: 20,
    label: '[1]',
    sources: [{ type: 'web', url: 'https://example.com', title: 'Example' }]
  }
];

markedBlock.value = '...markdown text...';
markedBlock.refs = refs;
```

---

## Intent System

Make the LLM output structured intent-json blocks by adding instructions to the system prompt:

```ts
import { IntentPromptBuilder, PresetIntent } from '@iyulab/chat-components';

// Use preset intents
IntentPromptBuilder.instance.use(PresetIntent.Questions);

// Add custom intent
IntentPromptBuilder.instance.add({
  type: 'rating',
  description: 'Ask user to rate something on a scale',
  properties: {
    label: { type: 'string', description: 'What to rate' },
    max: { type: 'number', description: 'Max score (default: 5)' }
  },
  required: ['label']
});

// Inject into system prompt
const systemPrompt = IntentPromptBuilder.instance.build();
```

Parse intent-json from the LLM response and render components:

```ts
const [cleanText, intents] = IntentPromptBuilder.instance.parse(llmResponse);

for (const intent of intents) {
  if (intent.type === 'question') {
    const el = document.createElement('u-question-intent');
    el.question = intent.properties?.question;
    el.choices = intent.properties?.choices ?? [];
    messageEl.appendChild(el);
  }
}

markedBlock.value = cleanText;
```

---

## View System

Let the LLM render rich content (charts, maps, videos, etc.) via view-json code blocks:

```ts
import { ViewPromptBuilder, PresetView } from '@iyulab/chat-components';

// Use all preset views
ViewPromptBuilder.instance.use(PresetView.All);
// Or selectively
ViewPromptBuilder.instance.use(PresetView.Images | PresetView.Chart);

// Inject into system prompt
const systemPrompt = ViewPromptBuilder.instance.build();
```

When `u-marked-block` encounters a view-json code block from the LLM, it automatically renders it via `u-view`:

````
```view-json
{
  "tag": "u-chart-view",
  "properties": {
    "type": "bar",
    "data": { "labels": ["A", "B"], "datasets": [{ "data": [10, 20] }] }
  }
}
```
````

---

## Rendering BlockItem Arrays

Pattern for rendering structured message data received from a server:

```ts
import type { BlockItem } from '@iyulab/chat-components';

function renderBlocks(blocks: BlockItem[], container: HTMLElement) {
  for (const block of blocks) {
    switch (block.type) {
      case 'text': {
        const el = document.createElement('u-text-block');
        el.value = block.value;
        container.appendChild(el);
        break;
      }
      case 'markdown': {
        const el = document.createElement('u-marked-block');
        el.value = block.value;
        el.refs = block.refs;
        container.appendChild(el);
        break;
      }
      case 'thinking': {
        const el = document.createElement('u-think-block');
        el.loading = block.loading ?? false;
        el.value = block.value;
        container.appendChild(el);
        break;
      }
      case 'tool': {
        const el = document.createElement('u-tool-block');
        el.loading = block.loading ?? false;
        el.title = block.title ?? '';
        el.input = block.input;
        el.output = block.output;
        container.appendChild(el);
        break;
      }
      case 'file': {
        const el = document.createElement('u-file-block');
        el.name = block.name;
        el.size = block.size;
        el.type = block.mimeType;
        el.url = block.url;
        el.status = block.status ?? 'idle';
        container.appendChild(el);
        break;
      }
      case 'reference': {
        const el = document.createElement('u-ref-block');
        el.sources = block.sources;
        container.appendChild(el);
        break;
      }
    }
  }
}
```
