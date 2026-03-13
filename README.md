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

## Utilities

### DOM Interaction

LLM이 웹 페이지의 DOM을 스캔하고 인터랙션할 수 있게 하는 자동화 유틸리티입니다. Shadow DOM까지 깊게 탐색하며, LLM 컨텍스트 최적화를 위한 스마트 필터링을 제공합니다.

#### 주요 기능
- **DOM 스캐닝**: Shadow DOM 포함 전체 DOM 트리 탐색
- **스마트 필터링**: LLM 컨텍스트 절약을 위한 우선순위 기반 필터링
- **시각적 캡처**: html2canvas를 통한 스크린샷 지원
- **자동화**: 11가지 명령 타입 지원 (click, input, select, focus, blur, scroll, scrollTo, hover, clear, check, wait)
- **이벤트 시스템**: EventTarget 기반 이벤트 발생 및 수신

#### Basic Usage

```typescript
import { DOMAgent } from '@iyulab/chat-components/utilities/dom-interaction';

const agent = new DOMAgent();

// DOM 스캔 (Shadow DOM 포함)
const scan = await agent.start(document.body, {
  maxElements: 50,
  filterStrategy: 'described',  // 'all' | 'interactive' | 'described' | 'visible'
  includeScreenshot: true,
  debug: false  // 디버그 로그 활성화하려면 true로 변경
});

console.log(scan.elements);  // 스캔된 요소 목록
console.log(scan.screenshot);  // Base64 PNG 이미지

// 명령 실행
const result = await agent.execute({
  action: 'click',
  elementId: 'elm_abc123'
});

// 명령 실행 후 자동 재스캔
const updated = await agent.executeAndRescan({
  action: 'input',
  elementId: 'elm_def456',
  value: 'Hello'
});

// LLM 프롬프트 생성
import { DOMPromptBuilder } from '@iyulab/chat-components/utilities/dom-interaction';

const builder = new DOMPromptBuilder();
const prompt = builder.buildPrompt(scan.elements, {
  includeInvisible: false,
  maxElements: 30
});

// LLM 응답에서 명령 추출
const commands = builder.extractCommands(llmResponse);
await agent.executeMany(commands);

// Anthropic Claude 멀티모달 형식
const claudeMessage = builder.formatMultimodalMessage(
  scan.elements,
  scan.screenshot,
  'claude'
);

// OpenAI GPT-4V 형식
const gptMessage = builder.formatMultimodalMessage(
  scan.elements,
  scan.screenshot,
  'openai'
);
```

#### Debug Mode

디버그 모드를 활성화하면 스캐닝 과정의 상세한 로그를 볼 수 있습니다:

```typescript
const scan = await agent.start(document.body, {
  debug: true  // 콘솔에 상세 로그 출력
});
```

#### Events

```typescript
agent.addEventListener('scan', (e) => {
  console.log('Scan completed:', e.detail);
});

agent.addEventListener('execute', (e) => {
  console.log('Command executed:', e.detail);
});

agent.addEventListener('error', (e) => {
  console.error('Error occurred:', e.detail);
});
```

#### 자동화 예제

```typescript
// LLM과 연동한 자동화 루프
await agent.automate({
  maxIterations: 10,
  includeScreenshot: true,
  onIteration: async (scan, iteration) => {
    // LLM에 프롬프트 전송
    const prompt = builder.buildPrompt(scan.elements);
    const response = await callLLM(prompt, scan.screenshot);
    
    // LLM 응답에서 명령 추출
    const commands = builder.extractCommands(response);
    
    if (commands.length === 0) {
      return null;  // 종료
    }
    
    return commands;  // 실행할 명령 반환
  }
});
```

#### 자동화 예제

```typescript
// LLM과 연동한 자동화 루프
await agent.automate({
  maxIterations: 10,
  includeScreenshot: true,
  onIteration: async (scan, iteration) => {
    // LLM에 프롬프트 전송
    const prompt = builder.buildPrompt(scan.elements);
    const response = await callLLM(prompt, scan.screenshot);
    
    // LLM 응답에서 명령 추출
    const commands = builder.extractCommands(response);
    
    if (commands.length === 0) {
      return null;  // 종료
    }
    
    return commands;  // 실행할 명령 반환
  }
});
```

#### 자연어 명령 (preview.ts 데모)

preview.ts에서는 간단한 자연어 명령을 지원합니다:

```typescript
// 클릭 명령
"카운터 증가 버튼 클릭"  // → data-llm-description 기반 자동 인식

// 입력 명령  
"이메일 입력 필드에 'test@example.com' 입력"

// 선택 명령
"색상 선택에서 '파란색' 선택"

// 체크 명령
"동의 체크"

// JSON 직접 전송
{"action": "click", "target": "elm_abc123"}
```

#### 실제 LLM 자동화 (preview.ts)

preview.ts에서 "Start Automation" 버튼을 클릭하면 실제 OpenAI API를 사용한 완전 자동화가 가능합니다:

1. **목표 입력**: "카운터를 10까지 올려주세요"
2. **자동 스캔**: DOM을 스캔하여 요소 정보 수집
3. **LLM 분석**: OpenAI GPT에 현재 상태와 목표 전송
4. **명령 추출**: LLM 응답에서 JSON 명령 배열 파싱
5. **자동 실행**: 명령 실행 후 재스캔
6. **반복**: 목표 달성까지 최대 10회 반복

```typescript
// preview.ts 내부 구현
await this.domAgent.automate({
  maxIterations: 10,
  includeScreenshot: true,  // 스크린샷도 LLM에 전송
  onIteration: async (scan, iteration) => {
    // 프롬프트 생성
    const prompt = this.promptBuilder.buildPrompt(scan.elements);
    
    // OpenAI API 호출
    const response = await openai.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [{ role: 'user', content: prompt }],
    });
    
    // 명령 추출 및 반환
    const commands = this.promptBuilder.extractCommands(response);
    return commands.length > 0 ? commands : null;  // null이면 종료
  }
});
```

## Documentation

자세한 사용법은 [docs](./docs/README.md)를 참고하세요.

## License

MIT
