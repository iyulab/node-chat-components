# @iyulab/chat-components Documentation

LLM 채팅 인터페이스를 구현하기 위한 Web Components 라이브러리입니다.

## Overview

이 패키지는 Lit 기반의 Web Components로 구성되어 있으며, 다음과 같은 특징을 가집니다:

- **Framework Agnostic**: React, Vue, Angular, Vanilla JS 등 모든 프레임워크에서 사용 가능
- **Modular Design**: 각 컴포넌트가 독립적으로 동작하며 필요한 것만 선택적으로 사용 가능
- **Rich Features**: Markdown 렌더링, 코드 하이라이팅, KaTeX 수식, JSON 뷰어 등 지원
- **LLM Optimized**: Tool 호출, Thinking 표시, 토큰 사용량 표시 등 LLM 특화 기능

## Quick Start

```javascript
// 모든 컴포넌트 등록
import '@iyulab/chat-components';

// 타입만 사용
import type { BlockItem, ToolBlockStatus } from '@iyulab/chat-components';
```

## Components

| Component | Tag | Description |
|-----------|-----|-------------|
| [Message](./components/Message.md) | `<u-message>` | 메시지 컨테이너, BlockItem 배열 렌더링 |
| [TextBlock](./components/TextBlock.md) | `<u-text-block>` | 텍스트 입력/표시 |
| [MarkdownBlock](./components/MarkdownBlock.md) | `<u-markdown-block>` | Markdown 렌더링 |
| [ThinkingBlock](./components/ThinkingBlock.md) | `<u-thinking-block>` | AI 추론 과정 표시 |
| [ToolBlock](./components/ToolBlock.md) | `<u-tool-block>` | Tool 호출 표시 |
| [CodeBlock](./components/CodeBlock.md) | `<u-code-block>` | 코드 하이라이팅 |
| [JsonViewer](./components/JsonViewer.md) | `<u-json-viewer>` | JSON 트리 뷰어 |
| [SendButton](./components/SendButton.md) | `<u-send-button>` | 전송/중지/재시도 버튼 |
| [AttachButton](./components/AttachButton.md) | `<u-attach-button>` | 파일 첨부 버튼 |
| [CopyButton](./components/CopyButton.md) | `<u-copy-button>` | 클립보드 복사 버튼 |
| [ThinkingButton](./components/ThinkingButton.md) | `<u-thinking-button>` | 추론 레벨 선택 |
| [TokenIndicator](./components/TokenIndicator.md) | `<u-token-indicator>` | 토큰 사용량 게이지 |

## Types

```typescript
// Block 타입들
interface TextBlockItem {
  type: "text";
  value?: string;
}

interface MarkdownBlockItem {
  type: "markdown";
  value?: string;
}

interface ThinkingBlockItem {
  type: "thinking";
  value?: string;
}

interface ToolBlockItem {
  type: "tool";
  status: ToolBlockStatus;  // "pending" | "paused" | "inProgress" | "success" | "failure"
  name?: string;
  input?: string;   // JSON string
  output?: string;  // JSON string
}

type BlockItem = TextBlockItem | MarkdownBlockItem | ThinkingBlockItem | ToolBlockItem;
```

## Events

| Event | Type | Description |
|-------|------|-------------|
| `u-submit` | `CustomEvent<string>` | 메시지 제출 |
| `u-stop` | `CustomEvent<undefined>` | 생성 중지 |
| `tool-approval` | `CustomEvent<{id, approved}>` | Tool 승인/거부 |
| `select-files` | `CustomEvent<FileList>` | 파일 선택 |
| `change` | `CustomEvent<ThinkingValue>` | 추론 레벨 변경 |

자세한 이벤트 문서: [Events](./events.md)

## Architecture

```
@iyulab/chat-components
├── components/
│   ├── message/          # 메시지 컨테이너
│   ├── text-block/       # 텍스트 블록
│   ├── markdown-block/   # 마크다운 블록
│   ├── thinking-block/   # 추론 블록
│   ├── tool-block/       # 도구 블록
│   ├── code-block/       # 코드 블록
│   ├── json-viewer/      # JSON 뷰어
│   ├── send-button/      # 전송 버튼
│   ├── attach-button/    # 첨부 버튼
│   ├── copy-button/      # 복사 버튼
│   ├── thinking-button/  # 추론 버튼
│   └── token-indicator/  # 토큰 표시기
├── events/               # 커스텀 이벤트 타입
└── internals/            # 내부 유틸리티
```

## Dependencies

- `@iyulab/components`: 기본 UI 컴포넌트 (Icon, Tooltip, Button, Spinner)
- `lit`: Web Components 프레임워크
- `marked`: Markdown 파싱
- `highlight.js`: 코드 하이라이팅
- `marked-katex-extension`: 수식 렌더링
