# Changelog

## [0.5.0] - 2026-04-01

### Added
- `AttachEvent` (`attach`) — file attach event (`detail.files: File[]`)
- `ChoiceEvent` (`choice`) — choice selection event (`detail.value: string`)
- DOM Agent utilities (`src/utilities/dom-agent/`) — experimental LLM web automation suite: `DOMScanner`, `DOMController`, `DOMAgent`, `DOMPromptBuilder` (currently excluded from main index export)
- `./react` package export entry point; `@lit/react` and `react` added as optional `peerDependencies`
- `html2canvas` dependency for screenshot capture support
- `ThinkingBlockItem.loading?: boolean` and `ToolBlockItem.loading?: boolean` fields
- `skills/iyulab-chat-components/` — full component reference and utility documentation

### Changed
- **Breaking:** Widget System renamed to View System: `UWidget` → `UView`, `UImagesWidget` → `UImagesView`, `UVideoWidget` → `UVideoView`, `UMapWidget` → `UMapView`, `UChartWidget` → `UChartView`; `WidgetDefinition` / `PresetWidget` → `ViewDefinition` / `PresetView`; `WidgetPromptBuilder` → `ViewPromptBuilder`
- **Breaking:** Action System renamed to Intent System: `UQuestionAction` → `UQuestionIntent`; `ActionDefinition` → `IntentDefinition`; `ActionPromptBuilder` → `IntentPromptBuilder`; `types/Actions.ts` → `types/Intents.ts`; `types/Widgets.ts` → `types/Views.ts`
- **Breaking:** `UCancelEvent` → `StopEvent`; `USubmitEvent` → `SendEvent`
- **Breaking:** `UFilesBlock` → `UFileBlock`; `FilesBlockItem` + `FileItem` → `FileBlockItem`; `FileUploadStatus` type removed — replaced by inline `status?: "idle" | "uploading" | "error"` field
- **Breaking:** `UToolBlock.heading` property renamed to `title`
- **Breaking:** `package.json` exports simplified from `./dist/*` to direct `./src/*` mapping; `chart.js` moved from `dependencies` to optional `peerDependencies`
- Component file structure consolidated: `.component.ts` + `.ts` split merged into single `.ts` file; registration switched to `@customElement()` decorator
- `UThinkBlock`: added `auto-scroll` attribute, public `scrollToBottom()` method, wheel/touch scroll interruption
- Updated dependencies: `@iyulab/components` ^0.4.0 → ^1.0.1, `marked` ^17.0.3 → ^17.0.5, `vite` ^7.3.1 → ^8.0.3, `openai` (dev) ^6.25.0 → ^6.33.0
- `README.md` fully rewritten; new `docs/` pages added (architecture, block system, events, intent system, view system)

### Fixed
- `UTableBlock`: inline markdown (`**bold**`, `` `code` ``, `<br>`, etc.) inside table cells now renders correctly using `Parser.parseInline()` instead of displaying as raw text

### Removed
- `UReportButton`, `URetryButton`, `UShareButton`
- `UCancelEvent`, `USubmitEvent` (replaced by `StopEvent`, `SendEvent`)
- `UQuestionAction` (replaced by `UQuestionIntent`)
- `UWidget`, `UImagesWidget`, `UVideoWidget`, `UMapWidget`, `UChartWidget` (replaced by View equivalents)
- `ActionPromptBuilder`, `WidgetPromptBuilder` (replaced by `IntentPromptBuilder`, `ViewPromptBuilder`)
- `types/Actions.ts`, `types/Widgets.ts` (replaced by `types/Intents.ts`, `types/Views.ts`)
- `utilities/converters.ts` (moved to `@iyulab/components`)
- All `.component.ts` split files

## [0.4.0] - 2026-03-03

### Added
- Widget System: `UWidget`, `UImagesWidget`, `UVideoWidget`, `UMapWidget`, `UChartWidget`
- Action System: `UQuestionAction` for clickable question choices (rendered from `action-json` block)
- New block types: `UFilesBlock` (file attachment list), `UTableBlock` (table display)
- `JsonSchema` types for LLM use (`BooleanJsonSchema`, `StringJsonSchema`, `NumberJsonSchema`, `ArrayJsonSchema`, `ObjectJsonSchema`)
- `ActionDefinition`, `ActionSchema`, `PresetAction`, `WidgetDefinition`, `PresetWidget` types
- `FilesBlockItem`, `FileItem`, `MessageFit` types
- `ActionPromptBuilder`, `WidgetPromptBuilder` LLM prompt generation utilities

### Changed
- **Breaking:** `UMessage.items` prop removed — block components must now be inserted via slots
- **Breaking:** `UMessage` base class changed from `BaseElement` to `UElement`; added `fit` attribute (`MessageFit`)
- `UMarkedBlock`: markdown rendering logic fully reworked
- `UPrompt`: style improvements

### Removed
- `UDotLoader` component

## [0.3.0] - 2026-01-22

### Added
- `URefBlock` component for displaying multiple reference sources
- Enhanced `URefCard` and `URefTag` components with improved functionality

### Changed
- `TextBlockReference` renamed to `ReferenceCitation`; field `name` renamed to `label`
- `url` field in `ReferenceSource` changed to optional

## [0.2.0] - 2026-01-16

### Added
- `UPrompt`, `UDotLoader` components for enhanced chat UI
- Reference components: `URefCard`, `URefCardGroup`, `URefTag`
- Button components: `UReportButton`, `URetryButton`, `UShareButton`, `UVoteButton`
- `UCancelEvent` replacing `UStopEvent`
- Type definitions: `BlockItem`, `BlockReference`, `JsonNode`
- Utility converters for data transformation
- Test utilities: `generator.ts`, `messages.ts`

### Changed
- `UJsonViewer` renamed to `UJsonBlock`
- Enhanced styling and functionality across multiple block components
- Updated `UAttachButton` and `UCopyButton` styling and behavior
- Improved `UMessage` component structure and styling

### Removed
- `USendButton`, `UThinkButton`
- `UStopEvent` (replaced by `UCancelEvent`)
- `UMessage.types.ts` (types moved to dedicated types directory)
- Internal `date-helpers` utility

## [0.1.1] - 2025-12-19

### Fixed
- Fixed `package.json` exports field with correct paths

## [0.1.0] - 2025-12-19

### Added
- Initial release
