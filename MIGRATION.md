# Migration Guide

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
