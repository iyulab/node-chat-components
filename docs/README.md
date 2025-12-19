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
import { theme } from '@iyulab/components/dist/utilities/theme.js';

// 테마 초기화 (앱 시작 시 한 번 호출)
theme.init({
  store: { type: 'localStorage', prefix: 'app-' },
});

// 테마 변경
theme.set('dark');  // 'light' | 'dark'

// 현재 테마 확인
const current = theme.get();
```

## Components

### Message
- `u-message` - AI 응답 메시지 컴포넌트

### Blocks
- `u-code-block` - 코드 블록 (syntax highlighting)
- `u-marked-block` - 마크다운 렌더링
- `u-text-block` - 텍스트 표시/편집
- `u-think-block` - AI 추론 과정 표시
- `u-tool-block` - 도구 호출 표시

### Buttons
- `u-attach-button` - 파일 첨부 버튼
- `u-copy-button` - 클립보드 복사 버튼
- `u-send-button` - 메시지 전송 버튼
- `u-think-button` - 추론 레벨 설정 버튼

## Documentation

- [MESSAGE.md](./components/MESSAGE.md) - 메시지 컴포넌트
- [BLOCKS.md](./components/BLOCKS.md) - 블록 컴포넌트
- [BUTTONS.md](./components/BUTTONS.md) - 버튼 컴포넌트
