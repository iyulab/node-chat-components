# @iyulab/chat-components

LLM 채팅 인터페이스를 위한 웹 컴포넌트 라이브러리

## Installation

```bash
npm install @iyulab/chat-components
```

## Usage

```typescript
import '@iyulab/chat-components';
```

## Components

### Message
- `u-message` - 채팅 메시지 컨테이너 (slot 기반)

### Blocks
- `u-code-block` - 코드 블록 (syntax highlighting)
- `u-json-block` - JSON 트리 시각화
- `u-marked-block` - 마크다운 렌더링 (인용 refs 지원)
- `u-text-block` - 텍스트 표시/편집
- `u-think-block` - AI 추론 과정 표시
- `u-tool-block` - 도구 호출 입출력 표시
- `u-ref-block` - 참조 출처 목록 블록

### Buttons
- `u-attach-button` - 파일 첨부
- `u-copy-button` - 클립보드 복사
- `u-vote-button` - 투표(좋아요/싫어요)
- `u-retry-button` - 메시지 재시도
- `u-share-button` - 메시지 공유
- `u-report-button` - 메시지 신고

### Prompt
- `u-prompt` - 채팅 입력 컴포넌트 (전송/취소 내장)

### References
- `u-ref-tag` - 본문 내 인용 태그
- `u-ref-card` - 출처 카드
- `u-ref-card-group` - 출처 카드 그룹

## Documentation

자세한 사용법은 [docs](./docs/README.md)를 참고하세요.

## License

MIT
