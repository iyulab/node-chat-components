# @iyulab/chat-components

LLM 채팅 인터페이스를 구축하기 위한 웹 컴포넌트 라이브러리입니다.

## Installation

```bash
npm install @iyulab/chat-components
```

## Import

```typescript
// 전체 컴포넌트 등록
import '@iyulab/chat-components';

// 개별 컴포넌트 import
import '@iyulab/chat-components/dist/components/message/UMessage.js';
import '@iyulab/chat-components/dist/components/blocks/UCodeBlock.js';
import '@iyulab/chat-components/dist/components/buttons/USendButton.js';
```

## Theme Setup

이 패키지는 `@iyulab/components`의 테마 시스템을 사용합니다.

```typescript
import { Theme } from '@iyulab/components/dist/utilities/Theme.js';

// 테마 초기화 (앱 시작 시 한 번 호출)
Theme.init({
  store: { type: 'localStorage', prefix: 'app-' },
});

// 테마 변경
Theme.set('dark');  // 'light' | 'dark'

// 현재 테마 확인
const current = Theme.get();
```

## Components

### Message
- `u-message` - 채팅 메시지 컴포넌트

### Blocks
- `u-code-block` - 코드 블록 (syntax highlighting)
- `u-json-block` - JSON 데이터 트리 표시
- `u-marked-block` - 마크다운 렌더링
- `u-text-block` - 텍스트 표시/편집
- `u-think-block` - AI 추론 과정 표시
- `u-tool-block` - 도구 호출 표시
- `u-ref-block` - 참조 출처 블록

### Buttons
- `u-attach-button` - 파일 첨부 버튼
- `u-copy-button` - 클립보드 복사 버튼
- `u-vote-button` - 투표(좋아요/싫어요) 버튼
- `u-retry-button` - 메시지 재시도 버튼
- `u-share-button` - 메시지 공유 버튼
- `u-report-button` - 메시지 신고 버튼

### Loaders
- `u-dot-loader` - 점 애니메이션 로더

### Prompt
- `u-prompt` - 채팅 입력 프롬프트

### References
- `u-ref-tag` - 참조 태그
- `u-ref-card` - 참조 카드
- `u-ref-card-group` - 참조 카드 그룹

## Documentation

- [MESSAGE.md](./components/MESSAGE.md) - 메시지 컴포넌트
- [PROMPT.md](./components/PROMPT.md) - 프롬프트 컴포넌트
- [BLOCKS.md](./components/BLOCKS.md) - 블록 컴포넌트
- [BUTTONS.md](./components/BUTTONS.md) - 버튼 컴포넌트
- [REFERENCES.md](./components/REFERENCES.md) - 참조 컴포넌트
