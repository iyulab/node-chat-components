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

<u-prompt placeholder="Type a message..."></u-prompt>
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
| `u-marked-block` | Markdown renderer — KaTeX, code highlighting, citation injection, block-json handling |
| `u-code-block` | Syntax-highlighted code block (Highlight.js) with language label and copy button |
| `u-text-block` | Plain text display or editable textarea |
| `u-file-block` | File card — type-based preview (image/video) or icon, click-to-open overlay, download, remove |
| `u-ref-block` | Reference source group — collapse/expand, card grid |
| `u-table-block` | Table — column sort, search, CSV/XLS download |

### Action Buttons

| Tag | Description |
|-----|-------------|
| `u-copy-button` | Copies text to clipboard; icon confirms copy |

---

## Extras System

Chart/images/map/video are optional and not part of the core import — bring them in via `@iyulab/chat-components/extras`:

```ts
import '@iyulab/chat-components/extras';
import { ExtraPromptBuilder, PresetExtra } from '@iyulab/chat-components';

// Build system prompt instructions
const extraInstructions = ExtraPromptBuilder.instance.use(PresetExtra.All).build();

const systemPrompt = `You are a helpful assistant.\n\n${extraInstructions}`;

// block-json blocks inside markdown are rendered automatically
markedBlock.value = llmResponse;
```

> - Extras system details: **[docs/extras-system.md](./docs/extras-system.md)**

---

## Events

| Event | Source | Detail | Description |
|-------|--------|--------|-------------|
| `send` | `u-prompt` | — | Send button clicked or Enter pressed |
| `stop` | `u-prompt` | — | Stop button clicked while loading |
| `remove` | `u-file-block` | — | Remove button clicked |

---

## Documentation

| File | Description |
|------|-------------|
| [docs/getting-started.md](./docs/getting-started.md) | Installation, basic chat UI, streaming, history rendering |
| [docs/architecture.md](./docs/architecture.md) | Package structure, class hierarchy, rendering pipeline |
| [docs/block-system.md](./docs/block-system.md) | Block components and `BlockItem` types in depth |
| [docs/extras-system.md](./docs/extras-system.md) | Extras system setup and custom extras |
| [docs/events.md](./docs/events.md) | Full event reference |

---

## License

MIT © iyulab
