# Getting Started

## Installation

```bash
npm install @iyulab/chat-components
```

`@iyulab/components` is a peer dependency — install it alongside if not already present:

```bash
npm install @iyulab/components @iyulab/chat-components
```

---

## Basic Setup

### 1. Register Components

Import once at application entry to register all `u-*` custom elements:

```ts
import '@iyulab/chat-components';
```

Or import individual components for tree-shaking:

```ts
import '@iyulab/chat-components/dist/components/message/UMessage.js';
import '@iyulab/chat-components/dist/components/prompt/UPrompt.js';
import '@iyulab/chat-components/dist/components/blocks/UMarkedBlock.js';
```

### 2. Build a Chat UI

```html
<style>
  #chat { display: flex; flex-direction: column; height: 100vh; }
  #messages { flex: 1; overflow-y: auto; padding: 1rem; }
</style>

<div id="chat">
  <div id="messages"></div>
  <u-prompt id="prompt" placeholder="Type a message...">
    <u-attach-button slot="left-actions" multiple>Attach</u-attach-button>
  </u-prompt>
</div>
```

```ts
import '@iyulab/chat-components';
import type { FileBlockItem } from '@iyulab/chat-components';

const prompt = document.getElementById('prompt') as any;
const messages = document.getElementById('messages')!;

// ── Send ────────────────────────────────────────────────
prompt.addEventListener('send', async () => {
  const text  = prompt.value as string;
  const files = prompt.files as FileBlockItem[] | undefined;
  if (!text && !files?.length) return;

  // Render user message
  appendMessage('right', text, files);
  prompt.value = '';
  prompt.files = [];

  // Render AI message placeholder
  const aiMsg = appendMessage('left');
  const block = aiMsg.querySelector('u-marked-block') as any;
  prompt.loading = true;

  // Stream LLM response
  for await (const chunk of streamLLM(text)) {
    block.value = (block.value ?? '') + chunk;
  }

  prompt.loading = false;
});

// ── Stop ────────────────────────────────────────────────
prompt.addEventListener('stop', () => {
  abortLLMStream();
  prompt.loading = false;
});

// ── File attach ─────────────────────────────────────────
prompt.addEventListener('attach', (e: any) => {
  const { files }: { files: File[] } = e.detail;
  prompt.files = [
    ...(prompt.files ?? []),
    ...files.map((f: File) => ({
      type: 'file' as const,
      name: f.name,
      size: f.size,
      mimeType: f.type,
      status: 'idle' as const,
    })),
  ];
});

// ── Helpers ─────────────────────────────────────────────
function appendMessage(position: 'left' | 'right', text?: string, files?: FileBlockItem[]) {
  const msg = document.createElement('u-message') as any;
  msg.position = position;

  if (files?.length) {
    for (const file of files) {
      const fb = document.createElement('u-file-block') as any;
      fb.name = file.name; fb.size = file.size; fb.type = file.mimeType;
      msg.appendChild(fb);
    }
  }

  const block = document.createElement('u-marked-block') as any;
  if (text) block.value = text;
  msg.appendChild(block);
  messages.appendChild(msg);
  return msg;
}
```

---

## LLM System Prompt Integration

Add intent and view instructions to your LLM system prompt:

```ts
import { IntentPromptBuilder, ViewPromptBuilder, PresetIntent, PresetView } from '@iyulab/chat-components';

const intentInstructions = IntentPromptBuilder.instance
  .use(PresetIntent.Questions)
  .build();

const viewInstructions = ViewPromptBuilder.instance
  .use(PresetView.All)
  .build();

const systemPrompt = `
You are a helpful assistant.

${intentInstructions}

${viewInstructions}
`.trim();
```

Parse the LLM response before rendering:

```ts
import { IntentPromptBuilder } from '@iyulab/chat-components';

const [cleanText, intents] = IntentPromptBuilder.instance.parse(llmResponse);

// Render clean markdown (views are handled automatically inside u-marked-block)
block.value = cleanText;

// Render intent components
for (const intent of intents) {
  if (intent.type === 'question') {
    const el = document.createElement('u-question-intent') as any;
    el.question = intent.properties?.question;
    el.choices  = intent.properties?.choices ?? [];
    el.addEventListener('choice', (e: any) => {
      prompt.value = e.detail.value;
      prompt.submit();
    });
    msg.appendChild(el);
  }
}
```

---

## Rendering Stored Messages (`BlockItem[]`)

When loading chat history from a server, render `BlockItem` arrays:

```ts
import type { BlockItem } from '@iyulab/chat-components';

function renderMessage(blocks: BlockItem[], position: 'left' | 'right') {
  const msg = document.createElement('u-message') as any;
  msg.position = position;

  for (const block of blocks) {
    switch (block.type) {
      case 'thinking': {
        const el = document.createElement('u-think-block') as any;
        el.value   = block.value;
        el.loading = block.loading ?? false;
        msg.appendChild(el); break;
      }
      case 'markdown': {
        const el = document.createElement('u-marked-block') as any;
        el.value = block.value;
        el.refs  = block.refs;
        msg.appendChild(el); break;
      }
      case 'tool': {
        const el = document.createElement('u-tool-block') as any;
        el.title  = block.title ?? '';
        el.input  = block.input;
        el.output = block.output;
        msg.appendChild(el); break;
      }
      case 'file': {
        const el = document.createElement('u-file-block') as any;
        el.name = block.name; el.size = block.size;
        el.type = block.mimeType; el.url = block.url;
        msg.appendChild(el); break;
      }
      case 'reference': {
        const el = document.createElement('u-ref-block') as any;
        el.sources = block.sources;
        msg.appendChild(el); break;
      }
      case 'text': {
        const el = document.createElement('u-text-block') as any;
        el.value = block.value;
        msg.appendChild(el); break;
      }
    }
  }

  messages.appendChild(msg);
}
```
