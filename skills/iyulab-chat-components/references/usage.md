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
prompt.addEventListener('send', (e) => {
  const { value } = e.detail;
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

// Handle file attachments (there is no built-in attach button — wire up your own)
fileInput.addEventListener('change', (e) => {
  const files = [...e.target.files];
  prompt.files = files.map(f => ({
    type: 'file',
    name: f.name,
    size: f.size,
    mimeType: f.type,
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

## Extra System

Let the LLM render rich content (charts, maps, image galleries, videos) via `block-json` code fences. See [extra-system.md](./extra-system.md) for full details.

```ts
import '@iyulab/chat-components';
import { prompt as extraInstructions } from '@iyulab/chat-components/extra';

const systemPrompt = `You are a helpful assistant.\n\n${extraInstructions}`;
```

`u-marked-block` automatically detects `block-json` fences and renders them via `u-element-block` — no parsing step needed:

````
```block-json
{
  "tag": "u-chart-block",
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
      case 'file': {
        const el = document.createElement('u-file-block');
        el.name = block.name;
        el.size = block.size;
        el.type = block.mimeType;
        el.url = block.url;
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
