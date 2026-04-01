# @iyulab/chat-components

Web component library for building LLM chat interfaces — works in any framework or vanilla HTML.

[![npm](https://img.shields.io/npm/v/@iyulab/chat-components)](https://www.npmjs.com/package/@iyulab/chat-components)
[![license](https://img.shields.io/npm/l/@iyulab/chat-components)](./LICENSE)

---

## Installation

```bash
npm install @iyulab/chat-components
```

---

## Quick Start

```ts
import '@iyulab/chat-components';
```

```html
<u-message>
  <u-marked-block value="# Hello&#10;&#10;This is **markdown**."></u-marked-block>
</u-message>

<u-prompt placeholder="Type a message...">
  <u-attach-button slot="left-actions" multiple>Attach</u-attach-button>
</u-prompt>
```

```ts
const prompt = document.querySelector('u-prompt');

prompt.addEventListener('send', () => {
  console.log('value:', prompt.value);
  console.log('files:', prompt.files);
});
```

> For a complete setup guide, see **[docs/getting-started.md](./docs/getting-started.md)**.

---

## Skills Usage

Skills for LLM coding agents (Claude Code, GitHub Copilot, Cursor, etc.).

```bash
# Install from GitHub
npx skills add iyulab/node-chat-components

# Reference locally after package install
npx skills add ./node_modules/@iyulab/chat-components
```

---

## Components

### Message & Input

| Tag | Description |
|-----|-------------|
| `u-message` | Chat message wrapper. Slot-based block layout, loading animation, bubble/default styles |
| `u-prompt` | Chat input. Auto-resize textarea, file attachment preview, integrated send/stop button |

### Content Blocks

| Tag | Description |
|-----|-------------|
| `u-marked-block` | Markdown renderer — KaTeX, code highlighting, citation injection, view-json/intent-json handling |
| `u-code-block` | Syntax-highlighted code block (Highlight.js) with language label and copy button |
| `u-text-block` | Plain text display or editable textarea |
| `u-think-block` | LLM reasoning block — collapse/expand, auto-scroll |
| `u-tool-block` | Tool call input/output display — collapse/expand |
| `u-file-block` | File card — type icon, upload status, download, remove |
| `u-ref-block` | Reference source group — collapse/expand, card grid |
| `u-json-block` | Collapsible JSON tree |
| `u-table-block` | Table — column sort, search, CSV/XLS download |

### Action Buttons

| Tag | Description |
|-----|-------------|
| `u-copy-button` | Copies text to clipboard; icon confirms copy |
| `u-vote-button` | Thumbs-up / thumbs-down vote pair |
| `u-attach-button` | Opens file picker; fires `attach` event |

---

## Intent & View Systems

```ts
import { IntentPromptBuilder, ViewPromptBuilder, PresetIntent, PresetView } from '@iyulab/chat-components';

// Build system prompt instructions
const intentInstructions = IntentPromptBuilder.instance.use(PresetIntent.Questions).build();
const viewInstructions   = ViewPromptBuilder.instance.use(PresetView.All).build();

const systemPrompt = `You are a helpful assistant.\n\n${intentInstructions}\n\n${viewInstructions}`;

// Parse LLM response
const [intents, cleanText] = IntentPromptBuilder.instance.parse(llmResponse);
markedBlock.value = cleanText;  // view-json blocks inside are rendered automatically

for (const intent of intents) {
  if (intent.type === 'question') {
    const el = document.createElement('u-question-intent') as any;
    el.question = intent.properties?.question;
    el.choices  = intent.properties?.choices ?? [];
    el.addEventListener('choice', (e: any) => { prompt.value = e.detail.value; prompt.submit(); });
    msg.appendChild(el);
  }
}
```

> - Intent system details: **[docs/intent-system.md](./docs/intent-system.md)**
> - View system details: **[docs/view-system.md](./docs/view-system.md)**

---

## Events

| Event | Source | Detail | Description |
|-------|--------|--------|-------------|
| `send` | `u-prompt` | — | Send button clicked or Enter pressed |
| `stop` | `u-prompt` | — | Stop button clicked while loading |
| `attach` | `u-attach-button` | `{ files: File[] }` | File selection completed |
| `choice` | `u-question-intent` | `{ value: string }` | Choice button clicked |
| `change` | `u-vote-button` | — | Vote state changed |
| `remove` | `u-file-block` | — | Remove button clicked |

---

## Documentation

| File | Description |
|------|-------------|
| [docs/getting-started.md](./docs/getting-started.md) | Installation, basic chat UI, streaming, history rendering |
| [docs/architecture.md](./docs/architecture.md) | Package structure, class hierarchy, rendering pipeline |
| [docs/block-system.md](./docs/block-system.md) | Block components and `BlockItem` types in depth |
| [docs/intent-system.md](./docs/intent-system.md) | Intent system setup and custom intents |
| [docs/view-system.md](./docs/view-system.md) | View system setup and custom views |
| [docs/events.md](./docs/events.md) | Full event reference |

---

## License

MIT © iyulab
