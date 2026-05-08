---
name: iyulab-chat-components
description: LLM chat UI component library. Covers all u-* custom elements for building chat interfaces — message rendering, chat input, markdown/code blocks, file attachments, reference citations, and the Intent/View system. Use when working with @iyulab/chat-components package.
license: MIT
metadata:
  author: iyulab
  version: "0.5.2"
---

# @iyulab/chat-components

Web component library for building LLM chat interfaces, built on [Lit](https://lit.dev/). All components are custom elements (`u-*` tags) that work in any framework or vanilla HTML.

## Quick Start

```bash
npm install @iyulab/chat-components
```

Import all components at once:

```ts
import '@iyulab/chat-components';
```

Import individual components (tree-shakable):

```ts
import '@iyulab/chat-components/dist/components/message/UMessage.js';
import '@iyulab/chat-components/dist/components/prompt/UPrompt.js';
```

> For detailed setup and usage patterns, see [./references/usage.md](./references/usage.md).

---

## Components

### Message & Input

- [`u-message`](./references/components/message.md) — Chat message wrapper. Slot-based block layout, loading animation, bubble/default style variants
- [`u-prompt`](./references/components/prompt.md) — Chat input component. File attachment preview, auto-resize textarea, integrated send/stop button

### Content Blocks

- [`u-marked-block`](./references/components/marked-block.md) — Renders markdown to HTML. KaTeX math, code highlighting, citation insertion, view-json/intent-json handling
- [`u-code-block`](./references/components/code-block.md) — Highlight.js code block with language label and clipboard copy
- [`u-text-block`](./references/components/text-block.md) — Plain text display or editable textarea
- [`u-think-block`](./references/components/think-block.md) — LLM reasoning (thinking) block. Collapse/expand, auto-scroll
- [`u-tool-block`](./references/components/tool-block.md) — Tool call input/output display. Collapse/expand
- [`u-file-block`](./references/components/file-block.md) — File attachment card. Type icon, upload status, download, remove
- [`u-ref-block`](./references/components/ref-block.md) — Reference source group block. Collapse/expand, grid of ref cards
- [`u-json-block`](./references/components/json-block.md) — Visualizes JSON data as a collapsible tree
- [`u-table-block`](./references/components/table-block.md) — Markdown table renderer. Column sort, search filter, CSV/XLS download

### Action Buttons

- [`u-copy-button`](./references/components/copy-button.md) — Clipboard copy button; icon changes after copy
- [`u-vote-button`](./references/components/vote-button.md) — Thumbs-up / thumbs-down vote button pair
- [`u-attach-button`](./references/components/attach-button.md) — File picker button; fires `attach` event with selected files

### Reference Components

- [`u-ref-tag`](./references/components/ref-tag.md) — Inline citation tag. Tooltip and external-link icon
- [`u-ref-card`](./references/components/ref-card.md) — Reference source card. web/document type, favicon, tags
- [`u-ref-card-group`](./references/components/ref-card-group.md) — Paginated group of reference cards

### Intent Components

- [`u-question-intent`](./references/components/question-intent.md) — LLM-generated question with clickable choice buttons

### View Components

- [`u-images-view`](./references/components/images-view.md) — Image gallery (carousel + lightbox)
- [`u-video-view`](./references/components/video-view.md) — YouTube / Vimeo / direct video file player
- [`u-chart-view`](./references/components/chart-view.md) — Chart.js charts (bar, line, pie, etc.)
- [`u-map-view`](./references/components/map-view.md) — OpenStreetMap embed
- [`u-view`](./references/components/view.md) — Dynamic custom element renderer (runtime for view-json blocks)

---

## Utilities

- [`IntentPromptBuilder`](./references/utilities/intent-prompt-builder.md) — Build LLM system prompt instructions for intents and parse intent-json responses
- [`ViewPromptBuilder`](./references/utilities/view-prompt-builder.md) — Build LLM system prompt instructions for views

---

## Types

- [`BlockItem`](./references/types.md) — Union type for message content blocks (text, markdown, file, tool, reference, thinking)
- `ReferenceSource` / `ReferenceCitation` — Citation source and inline citation position types
- `IntentDefinition` / `PresetIntent` — Intent definition and preset bit flags
- `ViewDefinition` / `PresetView` — View definition and preset bit flags

---

## Events

| Event | Source | Detail Type | Description |
|-------|--------|-------------|-------------|
| `send` | `u-prompt` | `unknown` | Send button clicked or Enter pressed |
| `stop` | `u-prompt` | `unknown` | Stop button clicked while loading |
| `attach` | `u-attach-button` | `{ files: File[] }` | File selection completed |
| `choice` | `u-question-intent` | `{ value: string }` | Choice button clicked |
| `change` | `u-vote-button` | `Event` | Vote state changed |
| `remove` | `u-file-block` | `RemoveEventDetail` | Remove button clicked |
