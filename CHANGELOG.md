# Changelog

## 0.5.0 (2026-04-01)

### Breaking Changes

#### Full rename: Widget → View, Action → Intent
- **Widget System → View System**: All widget components renamed to views
  - `UImagesWidget` → `UImagesView`
  - `UVideoWidget` → `UVideoView`
  - `UMapWidget` → `UMapView`
  - `UChartWidget` → `UChartView`
  - `UWidget` → `UView`
  - `types/Widgets.ts` → `types/Views.ts` (`WidgetDefinition`, `PresetWidget` → `ViewDefinition`, `PresetView`)
  - `WidgetPromptBuilder` → `ViewPromptBuilder`
- **Action System → Intent System**
  - `UQuestionAction` → `UQuestionIntent`
  - `types/Actions.ts` → `types/Intents.ts` (`ActionDefinition` → `IntentDefinition`)
  - `ActionPromptBuilder` → `IntentPromptBuilder`

#### Event type renames
- `UCancelEvent` → `StopEvent`
- `USubmitEvent` → `SendEvent`
- Importing the old names will cause compile errors

#### Block rename
- `UFilesBlock` → `UFileBlock` (plural → singular)
- `FilesBlockItem` + `FileItem` → `FileBlockItem` (simplified structure)
  - `FileUploadStatus` type removed — replaced by `status?: "idle" | "uploading" | "error"` field

#### Removed components
- `UReportButton`, `URetryButton`, `UShareButton` removed

#### `UToolBlock` property rename
- `heading` → `title`

#### `package.json` exports change
- `./dist/*` mapping simplified to a direct `./src/*` mapping
- `chart.js` moved from `dependencies` to optional `peerDependencies`

### Added

#### New events
- `AttachEvent` (`attach`) — file attach event (`detail.files: File[]`)
- `ChoiceEvent` (`choice`) — choice selection event (`detail.value: string`)

#### DOM Agent utilities (`src/utilities/dom-agent/`) — Experimental
A utility suite enabling LLMs to autonomously interact with web pages (currently disabled in the main index export)
- `DOMScanner` — scans the DOM and extracts interactive elements (includes Shadow DOM, supports filter strategies)
- `DOMController` — executes LLM commands (`click`, `input`, `select`, `scroll`, etc.) against the live DOM
- `DOMAgent` — orchestrates Scanner and Controller into an automation agent (event-driven, execution history)
- `DOMPromptBuilder` — builds LLM prompts and formats multimodal messages (Anthropic / OpenAI)

#### React bindings
- Added `./react` package export entry point
- `@lit/react` and `react` added as optional peerDependencies

#### html2canvas dependency
- Added `html2canvas` for screenshot capture support

#### Type improvements
- `ThinkingBlockItem`: added `loading?: boolean` field
- `ToolBlockItem`: added `loading?: boolean` field

#### Skills documentation
- `skills/iyulab-chat-components/` — full component reference and utility docs added

### Changed

#### Component file structure consolidation
- Split `.component.ts` + `.ts` pattern → merged into a single `.ts` file per component
- Component registration switched to `@customElement()` decorator

#### Bug fix
- `UTableBlock`: fixed inline markdown (**bold**, `` `code` ``, `<br>`, etc.) inside table cells rendering as raw text (now uses `Parser.parseInline()`)

#### `UThinkBlock` improvements
- Added `auto-scroll` attribute — automatically scrolls to bottom when `value` changes
- Added public `scrollToBottom()` method
- Auto-scroll is now interrupted by wheel or touch input

#### Dependency updates
- `@iyulab/components`: `^0.4.0` → `^1.0.1`
- `marked`: `^17.0.3` → `^17.0.5`
- `vite`: `^7.3.1` → `^8.0.3`
- `openai` (dev): `^6.25.0` → `^6.33.0`

#### Documentation overhaul
- `README.md` fully rewritten with detailed API documentation
- New `docs/` pages: architecture, block system, events, intent system, view system
- Old `docs/components/` files removed

### Removed
- `UReportButton`, `URetryButton`, `UShareButton`
- `UCancelEvent`, `USubmitEvent` (→ `StopEvent`, `SendEvent`)
- `UQuestionAction` (→ `UQuestionIntent`)
- `UWidget`, `UImagesWidget`, `UVideoWidget`, `UMapWidget`, `UChartWidget` (→ View equivalents)
- `ActionPromptBuilder`, `WidgetPromptBuilder` (→ `IntentPromptBuilder`, `ViewPromptBuilder`)
- `types/Actions.ts`, `types/Widgets.ts` (→ `types/Intents.ts`, `types/Views.ts`)
- `utilities/converters.ts` (moved to `@iyulab/components`)
- `TODO.md`
- All `.component.ts` split files

---

## 0.4.0 (2026-03-03)

### Breaking Changes
- `UMessage`: `items` prop removed — block components must now be inserted directly via slots
- `UMessage`: base class changed from `BaseElement` to `UElement`

### Added

#### Widget System
- `UWidget` — widget container component (dynamic rendering from `widget-json` blocks)
- `UImagesWidget` — scrollable image gallery widget
- `UVideoWidget` — video embed widget (YouTube, Vimeo, and direct URL support)
- `UMapWidget` — OpenStreetMap-based map widget (lat/lng coordinates and marker display)
- `UChartWidget` — Chart.js chart widget (8 types: bar, line, pie, doughnut, etc.; PNG/JSON download, fullscreen, auto dark-mode theme detection)

#### Action System
- `UQuestionAction` — clickable question choices component (rendered from `action-json` block)

#### New Block Types
- `UFilesBlock` — file attachment list block (filename, size, MIME type, download URL, optional delete button)
- `UTableBlock` — table display block

#### New Types
- `JsonSchema` — JSON Schema types for LLM use (`BooleanJsonSchema`, `StringJsonSchema`, `NumberJsonSchema`, `ArrayJsonSchema`, `ObjectJsonSchema`)
- `ActionDefinition`, `ActionSchema`, `PresetAction` — action definition and preset types
- `WidgetDefinition`, `PresetWidget` — widget definition and preset types (`Images`, `Video`, `Map`, `Chart`)
- `FilesBlockItem`, `FileItem` — file block types
- `MessageFit` — message width setting type (`full` | `auto`)

#### New Utilities
- `ActionPromptBuilder` — utility for auto-generating LLM action prompts
- `WidgetPromptBuilder` — utility for auto-generating LLM widget prompts

### Changed
- `UMessage`: migrated from `BaseElement` to `UElement`, removed `items` prop in favour of slot-based rendering, added `fit` attribute (`MessageFit`)
- `UMarkedBlock`: markdown rendering logic fully reworked
- `UPrompt`: style improvements

### Removed
- `UDotLoader` component removed

---

## 0.3.0 (2026-01-22)

- Renamed `TextBlockReference` to `ReferenceCitation` and field `name` to `label`
- Updated `url` field in `ReferenceSource` to be optiona
- Added `URefBlock` component for displaying multiple reference sources
- Enhanced `URefCard` and `URefTag` components with improved functionality

## 0.2.0 (2026-01-16)

### Added
- New components: `UPrompt`, `UDotLoader` for enhanced chat UI
- Reference components: `URefCard`, `URefCardGroup`, `URefTag` for displaying references
- New button components: `UReportButton`, `URetryButton`, `UShareButton`, `UVoteButton`
- `UCancelEvent` to replace `UStopEvent`
- Type definitions: `BlockItem`, `BlockReference`, `JsonNode`
- Utility converters for data transformation
- Test utilities: generator.ts, messages.ts

### Changed
- Renamed UJsonViewer to UJsonBlock for consistency
- Enhanced styling and functionality across multiple block components
- Updated button components styling and behavior (UAttachButton, UCopyButton)
- Improved UMessage component structure and styling

### Removed
- Deprecated buttons: USendButton, UThinkButton
- UStopEvent (replaced by UCancelEvent)
- UMessage.types.ts (types moved to dedicated types directory)
- Internal date-helpers utility

## 0.1.1 (2025-12-19)
- Update package.json exports field with correct paths

## 0.1.0 (2025-12-19)
- Initial library version release
