# Architecture

## Package Structure

```
src/
├── index.ts                        # Public exports
├── assets/
│   └── view-prompt.md              # View system prompt template
├── components/
│   ├── blocks/                     # Content block components
│   │   ├── UCodeBlock.ts
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
│   ├── references/
│   │   ├── URefCard.ts
│   │   ├── URefCardGroup.ts
│   │   └── URefTag.ts
│   └── views/
│       ├── UChartView.ts
│       ├── UImagesView.ts
│       ├── UMapView.ts
│       ├── UVideoView.ts
│       └── UView.ts
├── events/
│   ├── SendEvent.ts
│   └── StopEvent.ts
├── types/
│   ├── BlockItem.ts                # Message content block union type
│   ├── JsonSchema.ts               # JSON Schema types for LLM prompts
│   ├── References.ts               # ReferenceSource / ReferenceCitation
│   └── Views.ts                    # View definitions and preset flags
└── utilities/
    └── ViewPromptBuilder.ts        # View LLM instruction builder
```

---

## Component Layers

```
@iyulab/components (UElement base)
└── @iyulab/chat-components
    ├── UMessage          ← message container (slot-based)
    ├── UPrompt           ← chat input
    ├── Block components  ← content renderers (UMarkedBlock, UCodeBlock, ...)
    ├── Button components ← action buttons (UCopyButton)
    ├── Reference components ← citation UI (URefTag, URefCard, ...)
    └── View components   ← LLM-generated rich media (UChartView, UMapView, ...)
```

All components extend `UElement` from `@iyulab/components`.

---

## Two-Layer Content Model

Messages are composed of two layers:

```
u-message
├── [Blocks]    ← plain content (text, markdown, code, file, reference)
└── [Views]     ← rich media rendered from view-json code blocks (chart, map, images, video)
```

**Blocks** are static content pieces:
- Assembled manually from `BlockItem[]` data or rendered by `u-marked-block` from markdown

**Views** are rendered automatically:
- `ViewPromptBuilder` injects view instructions into the system prompt
- `u-marked-block` detects `view-json` code blocks and renders them via `u-view`

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
        └── ```view-json```  →  u-view  →  u-chart-view / u-map-view / ...
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
