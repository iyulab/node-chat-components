## High-Priority

### Dom 스캔 및 조작 컨트롤러 추가
- DOM 요소의 스캔 및 조작을 할 수 있는 유틸리티 기능을 추가

## Medium-Priority

### `u-message` 컴포넌트 개선
- 메시지 variant 스타일링 개선
### `u-prompt` 컴포넌트 개선
- `droppable` 프롭 추가하여 드롭 가능 영역으로 활용 가능하도록 개선
### `u-code-block` 컴포넌트 개선
- 프리뷰 모드 추가(`mermaid`, `svg`, `math` 등 지원)

## Low-Priority

### view 시스템 검토 및 개선
- 기존 view 시스템을 재검토하여, 보다 유연하고 확장 가능한 구조로 개선 및 보다 일관되고 사용하기 쉬운 API 제공
- `u-audio-view`, `u-timeline-view`, `u-3d-view` 등 새로운 view 유형 추가 검토
### intent 시스템 개선
- intent의 구조와 처리 방식을 재검토하여, 보다 명확하고 일관된 방식으로 의도를 정의하고 처리할 수 있도록 개선
- `u-form-intent`, `u-multiple-question-intent` 등 새로운 intent 유형 추가 검토
### marked 스트리밍 시스템 개선
- 스트리밍 데이터를 위한 최적화된 렌더링 방식 도입(저수준 레벨에서 직접 구현 검토)
