---
name: iyulab-chat-components
description: LLM chat UI component library. Covers all u-* custom elements for building chat interfaces — message rendering, chat input, markdown/code/table/file blocks, reference citations, and the block-json Extra system (chart/images/map/video). Use when working with @iyulab/chat-components package.
license: MIT
metadata:
  author: iyulab
  version: "0.7.0"
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

- [`u-marked-block`](./references/components/marked-block.md) — Renders markdown to HTML. KaTeX math, code highlighting, citation insertion, `block-json` extra handling
- [`u-code-block`](./references/components/code-block.md) — Highlight.js code block with language label and clipboard copy
- [`u-text-block`](./references/components/text-block.md) — Plain text display or editable textarea
- [`u-file-block`](./references/components/file-block.md) — File attachment card. Type icon or image/video thumbnail, click-to-preview, remove
- [`u-ref-block`](./references/components/ref-block.md) — Reference source group block. Collapse/expand, grid of ref cards
- [`u-table-block`](./references/components/table-block.md) — Markdown table renderer. Column sort, search filter, CSV/XLS download
- [`u-element-block`](./references/components/element-block.md) — Generic dynamic custom-element renderer, used internally to render `block-json` extras

### Reference Components

- [`u-ref-tag`](./references/components/ref-tag.md) — Inline citation tag. Tooltip and external-link icon
- [`u-ref-card`](./references/components/ref-card.md) — Reference source card. web/document type, favicon, tags
- [`u-ref-card-group`](./references/components/ref-card-group.md) — Paginated group of reference cards

### Extra Components (optional, `@iyulab/chat-components/extra`)

Not part of the core entrypoint — see [./references/extra-system.md](./references/extra-system.md) for setup.

- [`u-images-block`](./references/components/images-block.md) — Image gallery (carousel + lightbox)
- [`u-video-block`](./references/components/video-block.md) — YouTube / Vimeo / direct video file player
- [`u-chart-block`](./references/components/chart-block.md) — Chart.js charts (bar, line, pie, etc.)
- [`u-map-block`](./references/components/map-block.md) — OpenStreetMap embed

---

## Utilities

- [`ElementPromptBuilder`](./references/utilities/prompt-builder.md) — Build LLM system prompt instructions for `block-json` extras/elements
- [`HtmlBuilder`](./references/utilities/html-builder.md) — Build custom-element HTML strings (used internally by `u-marked-block`)

---

## Types

- [`BlockItem`](./references/types.md) — Union type for message content blocks (text, markdown, file, reference)
- `ReferenceSource` / `ReferenceCitation` — Citation source and inline citation position types
- `ElementSchema` / `JsonSchema` — Schema types for registering `block-json` extras/elements with `ElementPromptBuilder`

---

## Events

| Event | Source | Detail Type | Description |
|-------|--------|-------------|--------------|
| `send` | `u-prompt` | `SendEventDetail` (`{ value, files? }`) | Send button clicked or Enter pressed. Non-bubbling |
| `stop` | `u-prompt` | `StopEventDetail` (`{}`) | Stop button clicked while loading. Non-bubbling |
| `remove` | `u-file-block` | `RemoveEventDetail` | Remove button clicked |
