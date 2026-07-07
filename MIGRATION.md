# Migration Guide

## 0.6.x → 0.7.0

### `u-submit` / `u-cancel` 완전 제거

0.5.1부터 과도기 호환을 위해 `send`/`stop`과 함께 발행되던 `u-submit`/`u-cancel`이 예정대로 제거되었습니다.

```ts
// Before (0.6.x 이하, 둘 다 동작)
promptEl.addEventListener('u-submit', handler);
promptEl.addEventListener('send', handler);

// After (0.7.0, send/stop만 동작)
promptEl.addEventListener('send', handler);
promptEl.addEventListener('stop', handler);
```

### 제거된 컴포넌트 / 유틸리티

실제 사용되지 않는 것으로 확인되어 제거되었습니다. 대체 컴포넌트는 제공되지 않습니다 — 필요하다면 `0.6.x` 소스를 그대로 프로젝트에 복사해 사용하세요.

| 제거된 것 | 비고 |
|-----------|------|
| `u-tool-block` (`UToolBlock`) | 툴 호출 입출력 표시 블록 |
| `u-think-block` (`UThinkBlock`) | LLM 추론(thinking) 표시 블록 |
| `u-json-block` (`UJsonBlock`) | 접이식 JSON 트리 뷰어. `UToolBlock` 내부에서만 쓰였음 |
| `u-attach-button` (`UAttachButton`) | 파일 선택 버튼. `attach` 이벤트도 함께 제거 |
| `u-vote-button` (`UVoteButton`) | 투표(좋아요/싫어요) 버튼 |
| `u-question-intent` (`UQuestionIntent`) | Intent 시스템 UI |
| `IntentPromptBuilder`, `PresetIntent`, `types/Intents.ts` | Intent 시스템 전체 (Extras 시스템과 별개) |
| `ThinkingBlockItem`, `ToolBlockItem` | `BlockItem` union에서 제거 |
| `AttachEvent`, `ChoiceEvent` | 위 컴포넌트들과 함께 제거된 이벤트 타입 |

`u-copy-button` (`UCopyButton`)은 `u-code-block`이 내부적으로 사용하고 있어 유지됩니다.

`intent-json` 코드펜스를 사용 중이었다면, `u-marked-block`이 더 이상 이를 인식하지 않고 일반 코드 블록으로 렌더링합니다.

### View 시스템 → Extras 시스템

"View"라는 이름을 전부 걷어내고 "Extras"로 통일했습니다. 동작 방식은 거의 그대로이고, 이름과 파일 위치만 바뀌었습니다.

| Before (0.6.x) | After (0.7.0) |
|---|---|
| `u-view` (`UView`) | `u-extra-block` (`UExtraBlock`, `components/blocks/`로 이동) |
| `u-chart-view` (`UChartView`) | `u-chart-block` (`UChartBlock`, `components-extras/`로 이동) |
| `u-images-view` (`UImagesView`) | `u-images-block` (`UImagesBlock`) |
| `u-map-view` (`UMapView`) | `u-map-block` (`UMapBlock`) |
| `u-video-view` (`UVideoView`) | `u-video-block` (`UVideoBlock`) |
| `view-json` 코드펜스 | `block-json` |
| `ViewPromptBuilder` | `ExtraPromptBuilder` |
| `PresetView` | `PresetExtra` |
| `types/Views.ts` (`ViewDefinition`) | `types/Extras.ts` (`ExtraDefinition`, `element` 필드 제거됨) |
| `@iyulab/chat-components/chart` 서브패스 | `@iyulab/chat-components/extras` 서브패스 (4개 전부 한 번에 등록) |

```ts
// Before (0.6.x)
import '@iyulab/chat-components/chart';
import { ViewPromptBuilder, PresetView } from '@iyulab/chat-components';

const instructions = ViewPromptBuilder.instance.use(PresetView.All).build();
```

```ts
// After (0.7.0)
import '@iyulab/chat-components/extras';
import { ExtraPromptBuilder, PresetExtra } from '@iyulab/chat-components';

const instructions = ExtraPromptBuilder.instance.use(PresetExtra.All).build();
```

4개 중 일부만 필요해서 나머지(특히 `chart.js`)를 번들에 포함하고 싶지 않다면, `/extras`를 쓰지 말고 필요한 컴포넌트만 `dist` 경로로 직접 import하세요:

```ts
import '@iyulab/chat-components/dist/components-extras/UImagesBlock.js';
```

**에러 UI 제거:** `u-extra-block`은 대상 태그가 등록되어 있지 않거나 데이터가 유효하지 않아도 더 이상 에러 카드를 띄우지 않습니다. `/extras`를 import하지 않아 아직 등록 안 된 태그일 수도 있기 때문에, 콘솔 경고만 남기고 아무것도 렌더링하지 않습니다.

### `u-file-block` 정리

`FileBlockItem.status`/`UFileBlock.status`가 제거되었습니다(실사용 없음 확인). 이미지/비디오(`url` 있는 경우)는 아이콘 대신 실제 썸네일을 보여주고 클릭 시 오버레이로 원본을 확인할 수 있습니다.

```ts
// Before
{ type: 'file', status: 'idle', name, mimeType, size, url }

// After — status 필드 삭제
{ type: 'file', name, mimeType, size, url }
```

### `u-marked-block`의 `streaming` 플래그

`block-json` 블록의 `loading`이 이제 자기 펜스가 닫히는 시점이 아니라, 자기 펜스가 닫히고 **+** 메시지 전체가 1500ms 동안 추가 업데이트 없이 유휴 상태가 된 시점에 함께 꺼집니다. 별도 마이그레이션 작업은 필요 없습니다(자동 동작 변경).

## 0.4.x → 0.5.x

0.5.0은 여러 이름 변경을 포함한 breaking release입니다. 아래 매핑 표를 참고해 마이그레이션하세요.

### 이벤트 이름 변경 (DOM 문자열)

`UPrompt` (`<u-prompt>`)이 발생시키는 DOM 커스텀 이벤트 이름이 바뀌었습니다. `addEventListener`에 넘기는 **문자열**이 바뀐 것이므로, vanilla DOM/React ref 기반 소비자는 반드시 수정이 필요합니다.

| 0.4.x | 0.5.x | 설명 |
|-------|-------|------|
| `u-submit` | `send` | 사용자가 Enter 또는 send 버튼으로 입력을 제출할 때 |
| `u-cancel` | `stop` | 로딩 중 send 버튼을 눌러 중단할 때 |

```ts
// Before (0.4.x)
promptEl.addEventListener('u-submit', handler);
promptEl.addEventListener('u-cancel', handler);

// After (0.5.x)
promptEl.addEventListener('send', handler);
promptEl.addEventListener('stop', handler);
```

**0.5.1부터** 과도기 동안 `u-submit`/`u-cancel`이 `send`/`stop`과 **동시에** 발사되어 기존 소비자가 바로 깨지지 않습니다. 다만 이는 한시적 호환 조치이며, 새 코드는 `send`/`stop`을 사용하고 기존 코드도 이름을 전환하세요. **0.6.0에서 legacy 이름은 제거됩니다.**

### `SendEvent` / `StopEvent` detail 타입

0.5.1부터 `SendEvent.detail`이 `{ value: string; files?: FileBlockItem[] }` 형태로 타입이 구체화되었고, `submit()` 호출 시 실제 값이 채워집니다. 이전에는 `unknown`이었으며 소비자가 `element.value`를 별도로 조회해야 했습니다.

```ts
// Before (0.5.0)
el.addEventListener('send', () => {
  const v = el.value;       // 별도 조회 필요
});

// After (0.5.1)
el.addEventListener('send', (e) => {
  const { value, files } = e.detail;
});
```

`element.value` 조회 방식은 계속 동작하므로 기존 코드는 유지 가능.

### 클래스/타입 이름 변경

| 0.4.x | 0.5.x |
|-------|-------|
| `UCancelEvent` | `StopEvent` |
| `USubmitEvent` | `SendEvent` |
| `UWidget`, `UImagesWidget`, `UVideoWidget`, `UMapWidget`, `UChartWidget` | `UView`, `UImagesView`, `UVideoView`, `UMapView`, `UChartView` |
| `WidgetDefinition`, `PresetWidget`, `WidgetPromptBuilder` | `ViewDefinition`, `PresetView`, `ViewPromptBuilder` |
| `UQuestionAction` | `UQuestionIntent` |
| `ActionDefinition`, `ActionPromptBuilder` | `IntentDefinition`, `IntentPromptBuilder` |
| `types/Actions.ts`, `types/Widgets.ts` | `types/Intents.ts`, `types/Views.ts` |
| `UFilesBlock` | `UFileBlock` |
| `FilesBlockItem` + `FileItem` | `FileBlockItem` |
| `UToolBlock.heading` | `UToolBlock.title` |

### `FileUploadStatus` 제거

`FileUploadStatus` 타입이 제거되고, `FileBlockItem.status?: "idle" | "uploading" | "error"`로 인라인화되었습니다.

### 제거된 컴포넌트

`UReportButton`, `URetryButton`, `UShareButton`가 제거되었습니다. 필요 시 `u-button` + `u-icon` 조합으로 직접 구성하세요.

## Breaking Change 정책 (0.5.1 이후)

향후 공개 DOM 이벤트 이름, 속성, 커스텀 엘리먼트 태그명의 rename은 다음 절차를 따릅니다.

1. 신규 이름 도입 + 구 이름 alias **최소 1개 마이너 버전** 동안 병행 발행
2. 구 이름에 `@deprecated` JSDoc + MIGRATION.md 항목 추가
3. 이후 마이너에서 제거

이 정책은 0.5.0의 silent breaking change 사례 (AIMS 풀스택 스모크 중 발견)를 재발 방지하기 위한 것입니다.
