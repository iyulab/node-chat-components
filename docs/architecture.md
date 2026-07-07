# Architecture

## Package Structure

```
src/
├── index.ts                        # Public exports (core only — no chart/images/map/video)
├── extras.ts                       # `./extras` subpath: registers all 4 built-in extras at once
├── assets/
│   └── extra-prompt.md             # Extras system prompt template
├── components/
│   ├── blocks/                     # Content block components
│   │   ├── UCodeBlock.ts
│   │   ├── UExtraBlock.ts          # Generic tag/properties renderer used by u-marked-block
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
├── components-extras/              # Optional built-in extras, not part of core index.ts
│   ├── UChartBlock.ts
│   ├── UImagesBlock.ts
│   ├── UMapBlock.ts
│   └── UVideoBlock.ts
├── events/
│   ├── SendEvent.ts
│   └── StopEvent.ts
├── types/
│   ├── BlockItem.ts                # Message content block union type
│   ├── Extras.ts                   # Extra definitions and preset flags
│   ├── JsonSchema.ts               # JSON Schema types for LLM prompts
│   └── References.ts               # ReferenceSource / ReferenceCitation
└── utilities/
    └── ExtraPromptBuilder.ts       # Extras LLM instruction builder
```

---

## Component Layers

```
@iyulab/components (UElement base)
└── @iyulab/chat-components
    ├── UMessage          ← message container (slot-based)
    ├── UPrompt           ← chat input
    ├── Block components  ← content renderers (UMarkedBlock, UCodeBlock, UExtraBlock, ...)
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
└── [Extras]  ← rich media rendered from block-json code blocks (chart, map, images, video)
```

**Blocks** are static content pieces:
- Assembled manually from `BlockItem[]` data or rendered by `u-marked-block` from markdown

**Extras** are rendered automatically:
- `ExtraPromptBuilder` injects extra instructions into the system prompt
- `u-marked-block` detects `block-json` code blocks and renders them via `u-extra-block`
- The 4 built-in extras (chart/images/map/video) live in `components-extras/` and must be
  imported via `@iyulab/chat-components/extras` (or individually via the `dist/` path) —
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
        └── ```block-json```  →  u-extra-block  →  u-chart-block / u-map-block / ...
```

---

## Dependency Chain

```
@iyulab/components   ← peer dependency
        ↓
@iyulab/chat-components
        ├── marked + marked-katex-extension  (markdown parsing)
        ├── highlight.js                      (code highlighting)
        └── chart.js/auto                     (chart rendering, lazy)
```
