# Architecture

## Package Structure

```
src/
├── index.ts                        # Public exports
├── assets/
│   ├── intent-prompt.md            # Intent system prompt template
│   └── view-prompt.md              # View system prompt template
├── components/
│   ├── blocks/                     # Content block components
│   │   ├── UCodeBlock.ts
│   │   ├── UFileBlock.ts
│   │   ├── UJsonBlock.ts
│   │   ├── UMarkedBlock.ts
│   │   ├── URefBlock.ts
│   │   ├── UTableBlock.ts
│   │   ├── UTextBlock.ts
│   │   ├── UThinkBlock.ts
│   │   └── UToolBlock.ts
│   ├── buttons/
│   │   ├── UAttachButton.ts
│   │   ├── UCopyButton.ts
│   │   └── UVoteButton.ts
│   ├── intents/
│   │   └── UQuestionIntent.ts
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
│   ├── AttachEvent.ts
│   ├── ChoiceEvent.ts
│   ├── SendEvent.ts
│   └── StopEvent.ts
├── types/
│   ├── BlockItem.ts                # Message content block union type
│   ├── Intents.ts                  # Intent definitions and preset flags
│   ├── JsonNode.ts                 # JSON tree node types
│   ├── JsonSchema.ts               # JSON Schema types for LLM prompts
│   ├── References.ts               # ReferenceSource / ReferenceCitation
│   └── Views.ts                    # View definitions and preset flags
└── utilities/
    ├── IntentPromptBuilder.ts      # Intent LLM instruction builder
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
    ├── Button components ← action buttons (UCopyButton, UVoteButton, ...)
    ├── Reference components ← citation UI (URefTag, URefCard, ...)
    ├── Intent components ← LLM-generated interactive UI (UQuestionIntent)
    └── View components   ← LLM-generated rich media (UChartView, UMapView, ...)
```

All components extend `UElement` from `@iyulab/components`.

---

## Three-Layer Content Model

Messages are composed of three layers:

```
u-message
├── [Blocks]    ← plain content (text, markdown, code, file, tool, thinking, reference)
├── [Intents]   ← structured interactive prompts from the LLM (question + choices)
└── [Views]     ← rich media rendered from view-json code blocks (chart, map, images, video)
```

**Blocks** are static content pieces:
- Assembled manually from `BlockItem[]` data or rendered by `u-marked-block` from markdown

**Intents** are extracted from `intent-json` code blocks in the LLM response:
- `IntentPromptBuilder` injects intent instructions into the system prompt
- The app parses `intent-json` blocks and renders intent components manually

**Views** are rendered automatically:
- `ViewPromptBuilder` injects view instructions into the system prompt
- `u-marked-block` detects `view-json` code blocks and renders them via `u-view`

---

## Rendering Pipeline

```
LLM Response (raw text)
        │
        ▼
IntentPromptBuilder.parse()
├── cleanText  →  u-marked-block.value
│       │
│       ├── markdown  →  HTML
│       ├── ```code```  →  u-code-block
│       ├── |table|  →  u-table-block
│       ├── refs  →  u-ref-tag (inline)
│       └── ```view-json```  →  u-view  →  u-chart-view / u-map-view / ...
│
└── intents[]  →  u-question-intent (manually appended)
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
