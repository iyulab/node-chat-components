# Architecture

## Package Structure

```
src/
├── index.ts                        # Public exports (core only — no chart/images/map/video)
├── extra.ts                       # `./extra` subpath: registers all 4 built-in extra at once
├── assets/
│   └── prompts/
│       └── element-prompt.md       # Extra system prompt template
├── components/
│   ├── blocks/                     # Content block components
│   │   ├── UCodeBlock.ts
│   │   ├── UElementBlock.ts        # Generic tag/properties renderer used by u-marked-block
│   │   ├── UFileBlock.ts
│   │   ├── UMarkedBlock.ts
│   │   ├── URefBlock.ts
│   │   ├── UTableBlock.ts
│   │   └── UTextBlock.ts
│   ├── buttons/
│   │   └── UCopyButton.ts
│   ├── message/
│   │   └── UMessage.ts
│   ├── prompt/
│   │   └── UPrompt.ts
│   └── references/
│       ├── URefCard.ts
│       ├── URefCardGroup.ts
│       └── URefTag.ts
├── components-extra/              # Optional built-in extra, not part of core index.ts
│   ├── UChartBlock.ts
│   ├── UChartBlock.schema.ts       # ElementSchema for u-chart-block
│   ├── UImagesBlock.ts
│   ├── UImagesBlock.schema.ts      # ElementSchema for u-images-block
│   ├── UMapBlock.ts
│   ├── UMapBlock.schema.ts         # ElementSchema for u-map-block
│   ├── UVideoBlock.ts
│   └── UVideoBlock.schema.ts       # ElementSchema for u-video-block
├── events/
│   ├── SendEvent.ts
│   └── StopEvent.ts
├── types/
│   ├── BlockItem.ts                # Message content block union type
│   ├── Schema.ts                   # JsonSchema + ElementSchema types for LLM prompts
│   └── References.ts               # ReferenceSource / ReferenceCitation
└── utilities/
    └── PromptBuilder.ts     # Extra LLM instruction builder
```

---

## Component Layers

```
@iyulab/components (UElement base)
└── @iyulab/chat-components
    ├── UMessage          ← message container (slot-based)
    ├── UPrompt           ← chat input
    ├── Block components  ← content renderers (UMarkedBlock, UCodeBlock, UElementBlock, ...)
    ├── Button components ← action buttons (UCopyButton)
    ├── Reference components ← citation UI (URefTag, URefCard, ...)
    └── Extra components  ← LLM-generated rich media, optional (UChartBlock, UMapBlock, ...)
```

All components extend `UElement` from `@iyulab/components`.

---

## Two-Layer Content Model

Messages are composed of two layers:

```
u-message
├── [Blocks]  ← plain content (text, markdown, code, file, reference)
└── [Extra-Blocks]  ← rich media rendered from block-json code blocks (chart, map, images, video)
```

**Blocks** are static content pieces:
- Assembled manually from `BlockItem[]` data or rendered by `u-marked-block` from markdown

**Extra** are rendered automatically:
- `ElementPromptBuilder` injects extra instructions into the system prompt
- `u-marked-block` detects `block-json` code blocks and renders them via `u-element-block`
- The 4 built-in extras (chart/images/map/video) live in `components-extra/` and must be
  imported via `@iyulab/chat-components/extra` (or individually via the `dist/` path) —
  they are not part of core `index.ts`

---

## Rendering Pipeline

```
LLM Response (raw text)
        │
        ▼
u-marked-block.value
        │
        ├── markdown  →  HTML
        ├── ```code```  →  u-code-block
        ├── |table|  →  u-table-block
        ├── refs  →  u-ref-tag (inline)
        └── ```block-json```  →  u-element-block  →  u-chart-block / u-map-block / ...
```

---

## Dependency Chain

```
@iyulab/components   ← peer dependency
        ↓
@iyulab/chat-components
        ├── marked + marked-katex-extension  (markdown parsing)
        ├── highlight.js                      (code highlighting)
        └── chart.js/auto                     (chart rendering)
```
