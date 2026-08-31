# Changelog

## [0.11.5] - 2026-08-31

### Security

- **`UMarkedBlock` rendered unsanitized markdown output.** `marked` dropped
  its built-in `sanitize` option in v5 and leaves that entirely to the
  consumer; this component piped `marked`'s output straight into
  `unsafeHTML()` without ever making that call. Raw HTML embedded in
  markdown source (`<img onerror>`, `<script>`) ran verbatim, and
  `javascript:`/`data:`/`vbscript:` hrefs in ordinary links, images, and
  autolinks passed through untouched. Table cells hit the same gap
  through a second path (`renderTable`'s inline parser call was missing
  its options, silently falling back to `marked`'s unconfigured default
  renderer). Fenced-code-block content had the same problem one layer
  down — it reached `unsafeHTML()` unescaped even though a comment
  already claimed otherwise.
  Fixed by adding renderer overrides built on this package's existing
  HTML/href sanitizers (no new dependency) and closing both bypass
  paths.

## [0.11.4] - 2026-08-27

### Fixed

- **`u-ref-card-group`'s previous/next buttons and `u-file-block`'s preview
  close button had no accessible name.** All three are icon-only controls;
  without an explicit label a screen reader announced them as unnamed
  buttons. They now carry a localized `aria-label` (English and Korean).

## [0.11.3] - 2026-08-25

### Fixed

- **Pin `marked-katex-extension` to `5.1.10`.** Versions `5.1.11`/`5.1.12` publish their `types`
  field pointing at raw TypeScript source instead of compiled declarations (`./src/index.ts`
  instead of `./src/index.d.ts`). Under a strict `tsconfig.json` (`noImplicitReturns`,
  `noUnusedParameters`) with `moduleResolution: "bundler"`, that source file itself fails
  typecheck — for this package's own CI, and for any downstream project that installs it fresh
  and typechecks with similarly strict settings. No newer patched release exists yet, so the
  range is pinned exact instead of `^5.1.10`; it will widen again once upstream fixes the
  regression.

## [0.11.2] - 2026-08-07

### Fixed

- 🔴**`sideEffects` omitted this package's own entry barrel, so bundlers dropped every element
  registration.** The barrel that `exports["."]` resolves to exists solely to register the custom
  elements, but it was not in the `sideEffects` allowlist. A consumer writing
  `import '@iyulab/chat-components'` — the form this package's own documentation recommends — had the module
  elided entirely in a production build. The failure is silent: the build succeeds with no warning,
  the tags remain in the DOM, and an unregistered custom element renders nothing.

  Registration modules were already listed correctly. That was not enough: a dropped barrel means
  they are never reached.

  The `./extra` and `./react` subpath entries had the same gap.

  Both the source-resolved and published-artifact forms of every affected entry point are now
  declared, so workspace consumers and installed consumers get the same guarantee.

## [0.11.1] - 2026-08-05

### Fixed

- **Reference tag tooltip: the anchor gap was never applied.** The tooltip was configured
  with a `distance` attribute, which `u-tooltip` does not define — the offset property is
  `offset`. The tooltip now sits at the intended distance from its anchor.

## [0.11.0] - 2026-08-04

### Changed

- **로딩 자리표시자를 `u-skeleton[lines]` 로 회수했다** (표 블록 · 엘리먼트 블록).
  폭만 다른 막대 **9줄을 손으로 반복**하던 자리이며, 렌더 결과는 같다(마지막 줄이 짧아지는
  것은 종전 마크업도 그렇게 적고 있었다). `@iyulab/components >= 1.23.0` 이 필요하다.

- ⚠**차트 오류 문구가 «영어 기본 + 로케일 레지스트리»로 이주했다.** `Canvas 2D context` 실패
  안내가 한국어 리터럴이었다 — 화면에 그대로 뜨는 문자열이다.

  ```ts
  import { Locale } from '@iyulab/components';
  import { messages } from '@iyulab/chat-components';

  Locale.set('ko');                      // 한국어 환경은 종전 문구를 본다
  messages.register('ja', { canvasUnavailable: '…' });
  ```

  ⚠**한 키뿐인데 레지스트리를 둔 이유**: 영어 리터럴만으로는 한국어 앱이 그 문구를 되돌릴
  방법이 없다. 표준은 *"영어 기본 **+ 레지스트리**"* 다.

### Requires

- `@iyulab/components >= 1.23.0` (`Locale.namespace`) — 의존 하한을 올렸다.

## [0.10.0] - 2026-08-03

### Fixed

- ★**Firefox·Safari 에서 다크 코드블록·다크 마크다운이 적용된 적이 없던 문제.**

  두 컴포넌트의 다크 팔레트(구문 강조 15색 · 마크다운 11색)가
  `:host-context([theme="dark"])` **단독**으로 선언돼 있었다. 그 선택자는 크로미움
  전용이라, 나머지 두 엔진에서는 어두운 코드블록 위에 **라이트용 색이 그대로** 남았다.

  ```
  u-code-block     구문 강조 15색
  u-marked-block   본문·테두리·강조 11색
  ```

  섀도 루트 안에서 문서 루트의 테마를 읽는 수단 중 **상속되는 것은 `color-scheme`** 이고,
  `light-dark()` 가 그 값을 따른다. 테마 시트가 `:root[theme="dark"] { color-scheme: dark }`
  를 이미 선언하므로 별도 배선이 필요 없다.

  ⚠**소비자 조치**: 테마 시트를 로드하지 않고 `theme` 속성만 세우고 있다면 다크가
  적용되지 않는다 — 문서 루트에 `color-scheme: dark` 를 함께 선언할 것.
  `@supports` 가드가 있어 `light-dark()` 미지원 브라우저는 **라이트로 떨어진다**
  (종전 Firefox·Safari 와 같은 결과 — 회귀가 아니다).

- **참조 카드 헤더의 포커스 링이 팔레트에 없는 색이었다** — `rgba(100, 150, 250, .6)`
  를 굽고 있었다. 다른 컴포넌트의 포커스 링과 색이 달랐고 브랜드를 따라오지 않았다.
  역할 토큰(`--u-primary-color-strong`)을 읽도록 고쳤다 — 디자인 시스템의 전역 포커스 링과
  같은 값이다.

### Added

- **섀도 안 테마 해석 회귀 테스트** — 실제 크로미움에서 `color-scheme` 을 뒤집어
  구문색·본문색이 따라오는지 확인한다. 커스텀 프로퍼티를 직접 읽지 않고 **그것을 소비하는
  선언의 계산색**을 재는데, `getComputedStyle().getPropertyValue()` 는 해석된 색이 아니라
  `light-dark(...)` 문자열 그대로를 돌려주기 때문이다.

## [0.9.1] - 2026-08-02

### Fixed

- **토큰 폴백 리터럴 9곳이 정본 시트와 어긋나 있던 문제.**
  `var(--u-danger-color, #E53935)` 처럼 배선된 리터럴은 **시트 값의 복제**여야 하는데,
  ⑴ `@iyulab/components` 1.16.0 의 역할 단 재매핑을 받지 못한 값(6곳)과
  ⑵ 애초에 시트에 없던 임의 값(`#4a90e2`·`#f3f4f6`·`rgba(0,0,0,0.02)` — 3곳)이 섞여 있었다.

  ⚠**이 결함은 개발 환경에서 절대 드러나지 않는다.** 토큰 시트가 있으면 폴백은 아예
  평가되지 않는다 — 깨지는 곳은 시트를 로드하지 않은 소비자의 화면이고, 우리가 보지
  못하는 자리다. 모노레포 루트의 `npm run tokens:sync` 가 이제 정본 시트와 대조한다.

## [0.9.0] - 2026-08-01

### Changed

- **강조·상태·텍스트 색이 역할 토큰을 경유한다**(팔레트 직접 참조 33 → 21).
  종전에는 팔레트(`--u-blue-600` 등)를 직접 읽어, 소비자가 브랜드를 다른 색으로 잡아도
  참조 카드의 링크 강조나 배지 색이 따라오지 않았다. 팔레트는 **이름이 곧 값의 약속**이라
  소비자가 그것을 덮으면 *진짜 그 색*이 필요한 곳까지 오염된다.

  ⚠**남은 21곳은 의도적이다** — 표면 단계(`--u-neutral-{0,50,100,200,600}`)와 상태 표면
  틴트(`--u-{blue,green,red}-0`)에는 역할 층에 등가물이 없다. 상호작용 상태 이름
  (`--u-bg-color-hover` 등)에 면 높이를 얹으면 의미가 어긋나므로 옮기지 않았다.
  대조 테스트가 예외 목록을 고정한다.

### Fixed

- **소스 규약 테스트가 실행되지 않던 설정 문제 수정** — `vitest.config.ts` 의 `include` 가
  `tests/browser/**` 뿐이라 그 밖의 테스트 파일은 **실패가 아니라 부재로** 조용히 빠졌다.
  `unit` 프로젝트를 추가했다.

## [0.8.0] - 2026-07-19

### Fixed
- **채팅 메시지의 이모지가 조용히 분해되던 결함 수정** — `stripZeroWidth` 가 보이지 않는 문자를 제거하면서 ZWJ(U+200D)까지 지웠다. ZWJ 는 이모지 시퀀스를 결합하는 조판 문자이므로, `UMarkedBlock` 이 메시지 본문에 이 함수를 적용할 때 가족·직업 이모지가 낱개로 쪼개졌다(👨‍👩‍👧 → 👨👩👧). 이제 표시 경로는 ZWJ 를 보존하고, URL 위생 경로(`escapeHtmlHref`)는 종전대로 ZWJ 까지 제거해 `java<ZWJ>script:` 형태의 protocol 우회를 계속 차단한다. 두 경로의 요구가 반대이므로 문자 집합을 분리했다. 회귀 테스트 7건 추가.

### Changed
- **이 패키지의 eslint 가 실제로 동작하기 시작했다.** `eslint.config.js` 의 두 결함 — (1) `files: ["src/**/*"]` 가 ESLint 9 에서 universal 패턴이라 `.ts` 를 opt-in 하지 못함, (2) 배열 프리셋(`tseslint.configs.recommended`)을 객체 스프레드해 프리셋이 무력화됨 — 을 수정했다. `build` 스크립트의 `eslint &&` 게이트는 매칭 파일이 0개라 항상 통과하고 있었다. 위 이모지 결함은 이 복구로 처음 드러났다.
- `npm run lint` / `npm run lint:fix` 스크립트 추가.
- **타입 정밀화(소비자 영향 가능)**: `BaseJsonSchema` 의 `default`/`enum`/`examples` 가 `any` → 새 `JsonValue` 타입으로, `FileBlockItem.data` 가 `any` → `unknown` 으로 좁혀졌다. 값을 그대로 사용하던 코드는 좁히기(narrowing)나 캐스팅이 필요할 수 있다.
- `UMarkedBlock`: 재할당 없는 `let` → `const`.

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
