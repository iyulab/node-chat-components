# Changelog

## 0.4.0 (2026-03-03)

### Breaking Changes
- `UMessage`의 `items` prop이 제거됨 — slot 방식으로 블록 컴포넌트를 직접 삽입해야 함
- `UMessage`의 `BaseElement` 의존성이 `UElement`로 변경됨

### Added

#### Widget System
- `UWidget` - 위젯 컨테이너 컴포넌트 (widget-json 블록 기반 동적 렌더링)
- `UImagesWidget` - 이미지 갤러리 위젯 (스크롤 가능한 이미지 목록 표시)
- `UVideoWidget` - 비디오 임베드 위젯 (YouTube, Vimeo, 직접 URL 지원)
- `UMapWidget` - OpenStreetMap 기반 지도 위젯 (위경도 좌표 및 마커 표시)
- `UChartWidget` - Chart.js 기반 차트 위젯 (bar, line, pie, doughnut 등 8가지 타입, PNG/JSON 다운로드, 전체화면, 다크모드 테마 자동 감지)

#### Action System
- `UQuestionAction` - 클릭 가능한 선택지를 제공하는 질문 액션 컴포넌트 (action-json 블록 기반)

#### New Block Types
- `UFilesBlock` - 파일 첨부 목록 표시 블록 (파일명, 크기, MIME 타입, 다운로드 URL 지원, 삭제 버튼 옵션)
- `UTableBlock` - 테이블 표시 블록

#### New Types
- `JsonSchema` - LLM용 JSON Schema 타입 (`BooleanJsonSchema`, `StringJsonSchema`, `NumberJsonSchema`, `ArrayJsonSchema`, `ObjectJsonSchema`)
- `ActionDefinition`, `ActionSchema`, `PresetAction` - 액션 정의 및 프리셋 타입
- `WidgetDefinition`, `PresetWidget` - 위젯 정의 및 프리셋 타입 (`Images`, `Video`, `Map`, `Chart`)
- `FilesBlockItem`, `FileItem` - 파일 블록 타입
- `MessageFit` - 메시지 너비 설정 타입 (`full` | `auto`)

#### New Utilities
- `ActionPromptBuilder` - LLM 액션 프롬프트 자동 생성 유틸리티
- `WidgetPromptBuilder` - LLM 위젯 프롬프트 자동 생성 유틸리티

### Changed
- `UMessage`: `BaseElement` → `UElement` 로 변경, `items` prop 제거 및 slot 기반 렌더링으로 전환, `fit` 속성(`MessageFit`) 추가
- `UMarkedBlock`: 마크다운 렌더링 로직 전면 개선
- `UPrompt`: 스타일 개선

### Removed
- `UDotLoader` 컴포넌트 제거

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
