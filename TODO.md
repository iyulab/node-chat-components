## Action 시스템 검토 및 개선
- 기존의 Action 시스템을 재검토하여, 보다 유연하고 확장 가능한 구조로 개선
- Action 정의 및 관리 방식을 개선하여, 새로운 액션 유형 추가 시 코드 변경 최소화
- `u-question-action`의 `multiple` 속성으로 다중 선택 기능 추가
- `u-form-action` 기능 추가 - 다양한 입력 유형 지원 (텍스트, 드롭다운, 체크박스 등)
- 기타 `u-quiz-action`, `u-poll-action`, `u-confirm-action`, `u-upload-action` 등 액션 추가 검토

## Widget 시스템 검토 및 개선
- Widget 시스템의 구조와 인터페이스를 재검토하여, 보다 일관되고 사용하기 쉬운 API 제공
- 새로운 Widget 유형 추가 검토 (예: `u-audio-widget`, `u-timeline-widget`, `u-3d-widget` 등)

## `u-message` 컴포넌트 개선
- 메시지 variant 스타일링 개선

## `u-code-block` 컴포넌트 개선
- 프리뷰 모드 추가(`mermaid`, `svg`, `math` 등 지원)

## marked 스트리밍 시스템 개선
- 스트리밍 데이터를 위한 최적화된 렌더링 방식 도입