# Changelog

## [0.7.1] - 2026-07-12

### Fixed

- `u-ref-card`: no longer logs a spurious `Missing <script type="application/json">` console error on every render when driven by property bindings (the pattern `u-ref-block` itself uses). `URefCard` now overrides `UDataElement.load()` to skip JSON loading gracefully when neither a `data` argument nor a `<script type="application/json">` child is present; the script-payload path (used by `u-marked-block` reference tooltips via `URefCard.buildHTML`) is unaffected. Cards always rendered correctly — the error was cosmetic console noise, but it fired once per reference card per message in downstream consoles. (Reported by the Filer project.)
- `URefCard`'s redundant `error()` override was removed — since 0.7.0 the `UDataElement` base logs to the console without rendering an error card, so the override duplicated base behavior. Genuine load errors now log as `failed to load data for [u-ref-card]` instead of `Error in URefCard:`.

### Added

- Browser-mode regression tests (vitest + playwright, matching the `@iyulab/components` test setup) covering both `u-ref-card` data paths and the `u-ref-block` sources rendering acceptance criteria.

## [0.7.0] - 2026-07-07

### Changed

- **Breaking:** The View system is renamed to the **Extra** system, rendered via `u-element-block`, and the 4 built-in extras (chart/images/map/video) are no longer part of the core entrypoint:
  - `u-view` → `u-element-block` (`UElementBlock`, in `components/blocks/`)
  - `u-chart-view`/`u-images-view`/`u-map-view`/`u-video-view` → `u-chart-block`/`u-images-block`/`u-map-block`/`u-video-block` (`UChartBlock`/`UImagesBlock`/`UMapBlock`/`UVideoBlock`, in the new `components-extra/` folder, each with a co-located `{Name}Block.schema.ts`)
  - `view-json` fenced code blocks → `block-json`
  - `ViewPromptBuilder` → `ElementPromptBuilder`; the `PresetView`/`ViewDefinition` preset bit-flag system is dropped — each built-in extra defines its own `ElementSchema` in its `.schema.ts` file instead of a central preset map. `types/Views.ts` and `types/JsonSchema.ts` are merged into `types/Schema.ts`.
  - The `./chart` subpath is replaced by `./extra`, which exports a ready-built `prompt` string with all 4 built-ins registered:

    ```ts
    import { prompt as extraInstructions } from '@iyulab/chat-components/extra';
    ```

    Need only one or two and want to skip bundling the rest (e.g. skip `chart.js`)? Import the specific component directly via `@iyulab/chat-components/dist/components-extra/UImagesBlock.js` instead.
  - `u-element-block` no longer shows an error card for unregistered tags or invalid data — it renders nothing and logs to the console instead, since an unregistered tag is more often a missing `/extra` import than a real error.

- `u-marked-block` now tracks a `streaming` state (resets a 1500ms idle timer on every `value` update). A `block-json` extra's `loading` stays `true` until **both** its own fence is closed **and** the message has been idle for 1500ms, instead of turning off as soon as its own fence closes while the rest of the message keeps streaming.
- The 0.6.0 note about `./react` still re-exporting the chart component regardless of exclusion no longer applies — moving chart out of `components/` into `components-extra/` also dropped it from the generated `react/index.js` barrel.
- `UChartBlock` now imports `chart.js/auto` statically instead of lazy-loading it at render time. `chart.js` remains an optional peer dependency — only the load timing changed.
- Switched the icon set used by `u-code-block`, `u-table-block`, `u-prompt`, `u-ref-card`, `u-ref-tag`, and `u-chart-block` from ad-hoc `lib="bootstrap"` references to the package's own bundled icon set (`lib="internal-chat"`, see `src/utilities/icons.ts`).
- `UDataElement`-based components (`u-table-block`, `u-ref-card`, `u-element-block`, and any custom subclass) no longer render an error card UI when `data`/JSON parsing fails — the error is logged to the console only.
- `u-file-block`: preview now opens by clicking anywhere on the card instead of only the thumbnail (see **Removed** for the download button).
- `u-prompt`: `send` and `stop` events now fire with `bubbles: false, composed: false` (no longer cross the shadow boundary); send button restyled as a circular ghost button.
- `u-table-block`: fixed a CSS custom property typo, `--u-primary` → `--u-primary-color`, for the active sort column color.

### Removed

- **Breaking:** Legacy `u-submit`/`u-cancel` DOM events removed from `UPrompt`. They were dispatched alongside `send`/`stop` since 0.5.1 as a deprecation-period compatibility alias; 0.6.0 was the announced removal target. Use `send`/`stop` instead.
- **Breaking:** Removed unused components and their public exports:
  - Blocks: `u-tool-block` (`UToolBlock`), `u-think-block` (`UThinkBlock`), `u-json-block` (`UJsonBlock`)
  - Buttons: `u-attach-button` (`UAttachButton`), `u-vote-button` (`UVoteButton`), `u-copy-button` (`UCopyButton` — `u-code-block` now uses the copy-button shipped by `@iyulab/components` instead)
  - Intent system: `u-question-intent` (`UQuestionIntent`), `IntentPromptBuilder`, `PresetIntent`, `types/Intents.ts`
  - Related types: `ThinkingBlockItem` and `ToolBlockItem` removed from the `BlockItem` union; `AttachEvent`/`ChoiceEvent` removed
- **Breaking:** `FileBlockItem.status` and `UFileBlock.status` removed (unused in practice). `u-file-block` now renders an actual `<img>`/`<video>` thumbnail for image/video files with a `url` (instead of a generic icon) and opens a full-size overlay on click; other file types keep the icon. The download button and its click handler are also removed — there is no built-in download affordance anymore.
- **Breaking:** `u-code-block`'s `loading` property is removed — the header always shows the language icon now (no streaming spinner state).

  There is no drop-in replacement for the intent system or the removed blocks/buttons; if you rely on any of them, stay on `0.6.x` or vendor the component from that version's source.

## [0.6.0] - 2026-05-21

### Changed

- **Breaking:** `UChartView` removed from main entrypoint. Consumers must now explicitly import from the `@iyulab/chat-components/chart` subpath.

  **Migration:**
  ```ts
  // Before (0.5.x)
  import { UChartView } from '@iyulab/chat-components';

  // After (0.6.0)
  import '@iyulab/chat-components/chart';              // element registration only
  import { UChartView } from '@iyulab/chat-components/chart'; // + class export
  ```

  `PresetView.Chart` and `PRESET_VIEW_DEFINITIONS` remain in the main entrypoint — calling `ViewPromptBuilder.use(PresetView.Chart)` still works, but `UChartView` must be registered separately via the chart subpath.

- `ViewDefinition.element` is now optional. Definitions without `element` (e.g. chart) skip the custom element conflict check in `ViewPromptBuilder.add()`.

### Why

Bundlers that perform static analysis of dynamic imports (e.g. Turbopack / Next.js 16+) would fail at build time with `Can't resolve 'chart.js/auto'` even when `chart.js` is declared as an optional peer dependency, because `UChartView` was reachable from the main `index.js` barrel. Moving it to a separate subpath eliminates the static-analysis path for projects that don't use charts.

> **Note:** The `./react` subpath (`@iyulab/chat-components/react`) still re-exports `UChartView` due to a limitation in the react-wrapper build plugin. React consumers that don't use charts and target Turbopack should avoid the `./react` barrel import and import individual wrappers instead (e.g. `@iyulab/chat-components/react/UMarkedBlock`), or install `chart.js`.

## [0.5.2] - 2026-05-08

### Changed
- Updated runtime dependencies to newer patch/minor releases, including `@iyulab/components` (`^1.0.3` -> `^1.0.5`) and markdown stack updates (`marked` `^17.0.5` -> `^18.0.3`, `marked-katex-extension` `^5.1.7` -> `^5.1.8`).
- Refactored markdown HTML placeholder logic by extracting it from `UMarkedBlock` into a dedicated utility (`HtmlPlaceholder`) without changing public API behavior.

## [0.5.1] - 2026-04-15

### Added
- `UPrompt`: restored 0.4.x compatibility by emitting legacy `u-submit`/`u-cancel` events **alongside** `send`/`stop`; scheduled for removal in 0.6.0 (`@deprecated`).
- Refined `SendEventDetail` to `{ value: string; files?: FileBlockItem[] }`; `UPrompt.submit()` now emits the actual value in `detail`.
- Added `StopEventDetail` as an interface (currently empty, reserved for future extension).
- Added `MIGRATION.md` with a 0.4.x -> 0.5.x migration guide and documented breaking-change policy.

### Fixed
- Mitigated silent failures for vanilla DOM consumers in 0.5.0 by introducing aliases for event-name changes (`u-submit`/`u-cancel` -> `send`/`stop`), which had previously been documented only as type renames (`USubmitEvent` -> `SendEvent`).

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
