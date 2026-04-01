# DOM Interaction Module

LLM이 웹 페이지를 스캔하고 인터랙션할 수 있게 하는 유틸리티 모듈입니다.

## 개요

이 모듈은 세 가지 핵심 클래스를 제공합니다:

- **DOMScanner**: DOM 트리를 순회하며 인터랙티브 요소를 추출 (Shadow DOM 포함)
- **DOMController**: LLM 명령을 실행하여 실제 DOM 조작 수행
- **DOMAgent**: Scanner와 Controller를 통합한 오케스트레이터

## 설치

```typescript
import { DOMAgent } from '@iyulab/chat-components';
```

## 기본 사용법

### 1. 페이지 스캔

```typescript
import { DOMAgent, DOMPromptBuilder } from '@iyulab/chat-components';

const agent = new DOMAgent();

// 초기 스캔 수행
const scan = await agent.start({
  filterStrategy: 'interactive',  // 인터랙티브 요소만
  maxElements: 50                 // 최대 50개
});

console.log(scan);
// {
//   timestamp: 1234567890,
//   url: "https://example.com",
//   title: "Example Page",
//   elements: [...],
//   totalElements: 100,
//   filteredElements: 50
// }
```

### 2. 명령 실행

```typescript
// 클릭 명령
await agent.executeAndRescan({
  action: 'click',
  target: 'elm_abc123'  // Scanner가 생성한 ID
});

// 텍스트 입력
await agent.executeAndRescan({
  action: 'input',
  target: 'elm_xyz789',
  value: 'Hello World'
});

// 여러 명령 순차 실행
await agent.executeAndRescan([
  { action: 'input', target: 'elm_search', value: 'query' },
  { action: 'click', target: 'elm_submit' }
]);
```

### 3. 이벤트 리스닝

```typescript
agent.addEventListener('scan', (e) => {
  console.log('스캔 완료:', e.detail);
});

agent.addEventListener('execute', (e) => {
  console.log('명령 실행:', e.detail);
});

agent.addEventListener('error', (e) => {
  console.error('에러:', e.detail);
});
```

### 4. LLM 자동화

```typescript
import { DOMAgent, DOMPromptBuilder } from '@iyulab/chat-components';

const agent = new DOMAgent();
const promptBuilder = new DOMPromptBuilder();

await agent.automate(
  async (scan) => {
    // 1. LLM 친화적 프롬프트 생성
    const prompt = promptBuilder.buildPrompt(scan, {
      maxElements: 50,
      contextHint: '사용자가 로그인하려고 합니다.'
    });
    
    // 2. LLM에게 전달
    const llmResponse = await callLLM(prompt);
    
    // 3. 응답에서 명령 추출
    return promptBuilder.extractCommands(llmResponse);
  },
  {
    maxIterations: 10,
    stopCondition: (scan) => {
      // 목표 달성 시 중단
      return scan.elements.some(el => 
        el.text?.includes('Success')
      );
    }
  }
);
```

### 5. DOMPromptBuilder 단독 사용

```typescript
import { DOMScanner, DOMPromptBuilder } from '@iyulab/chat-components';

const scanner = new DOMScanner();
const promptBuilder = new DOMPromptBuilder();

// 스캔 수행
const scan = scanner.scan(document.body);

// LLM 프롬프트 생성
const prompt = promptBuilder.buildPrompt(scan, {
  maxElements: 100,
  contextHint: '사용자가 상품을 검색하려고 합니다.'
});

// LLM 호출
const llmResponse = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }]
  })
});

// 명령 추출 및 실행
const commands = promptBuilder.extractCommands(llmResponse.choices[0].message.content);
```

### 6. 멀티모달 LLM (스크린샷 포함)

```typescript
import { DOMAgent, DOMPromptBuilder } from '@iyulab/chat-components';

const agent = new DOMAgent();
const promptBuilder = new DOMPromptBuilder();

// 스크린샷 포함 스캔
const scan = await agent.start({ includeScreenshot: true });

// Claude 형식 메시지 생성
const message = promptBuilder.formatMultimodalMessage(scan, {
  maxElements: 50,
  contextHint: '버튼을 찾아서 클릭하세요.',
  screenshotFormat: 'anthropic'
});

// Claude API 호출
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': API_KEY,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json'
  },
  body: JSON.stringify({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [message]
  })
});

// 명령 추출 및 실행
const commands = promptBuilder.extractCommands(response.content[0].text);
await agent.executeAndRescan(commands);
```

## 지원 명령

| 명령 | 설명 | 예시 |
|------|------|------|
| `click` | 요소 클릭 | `{ action: 'click', target: 'elm_123' }` |
| `input` | 텍스트 입력 | `{ action: 'input', target: 'elm_123', value: 'text' }` |
| `select` | 옵션 선택 | `{ action: 'select', target: 'elm_123', value: 'option1' }` |
| `focus` | 포커스 이동 | `{ action: 'focus', target: 'elm_123' }` |
| `blur` | 포커스 해제 | `{ action: 'blur', target: 'elm_123' }` |
| `scroll` | 스크롤 | `{ action: 'scroll', value: { x: 0, y: 100 } }` |
| `scrollTo` | 요소로 스크롤 | `{ action: 'scrollTo', target: 'elm_123' }` |
| `hover` | 마우스 오버 | `{ action: 'hover', target: 'elm_123' }` |
| `clear` | 입력 필드 초기화 | `{ action: 'clear', target: 'elm_123' }` |
| `check` | 체크박스 토글 | `{ action: 'check', target: 'elm_123', value: true }` |
| `wait` | 대기 | `{ action: 'wait', value: 1000 }` |

## LLM 친화적인 HTML 작성

LLM이 페이지를 더 잘 이해하도록 하려면 `data-llm-description` 속성을 사용하세요:

```html
<button 
  data-llm-description="사용자 로그아웃 버튼"
  aria-label="로그아웃"
>
  로그아웃
</button>

<input 
  type="text"
  data-llm-description="검색어 입력 필드"
  placeholder="상품명을 입력하세요"
  aria-label="상품 검색"
/>
```

이 속성이 있는 요소는 우선순위가 높아져 더 많은 확률로 LLM에게 노출됩니다.

## 필터링 전략

스캔 시 필터링 전략을 선택할 수 있습니다:

- `all`: 모든 인터랙티브 요소 (테스트용)
- `interactive`: 주요 인터랙티브 요소만 (기본값)
- `described`: `data-llm-description` 있는 요소 우선
- `visible`: 화면에 보이는 요소만

## Shadow DOM 지원

Shadow DOM 내부 요소도 자동으로 스캔됩니다:

```typescript
const scan = await agent.start();

// Shadow DOM 요소 확인
const shadowElements = scan.elements.filter(el => el.inShadowDom);
```

## 고급 사용

### Scanner만 사용

```typescript
import { DOMScanner } from '@iyulab/chat-components';

const scanner = new DOMScanner();
const scan = scanner.scan(document.body, {
  maxElements: 100,
  filterStrategy: 'described'
});

// ID로 요소 가져오기
const element = scanner.getElement('elm_abc123');
```

### Controller만 사용

```typescript
import { DOMScanner, DOMController } from '@iyulab/chat-components';

const scanner = new DOMScanner();
const controller = new DOMController(scanner);

scanner.scan();
await controller.execute({ action: 'click', target: 'elm_123' });
```

## 히스토리

Agent는 실행 히스토리를 자동으로 저장합니다:

```typescript
const history = agent.getHistory();

history.forEach(item => {
  console.log('스캔:', item.scan);
  console.log('명령:', item.commands);
  console.log('결과:', item.results);
});

// 히스토리 초기화
agent.clearHistory();
```

## Phase 1 (완료)

- ✅ 기본 DOM 스캔
- ✅ Shadow DOM 지원
- ✅ 스마트 필터링
- ✅ 모든 기본 명령 실행
- ✅ 이벤트 시스템
- ✅ 자동화 모드

## Phase 2 (진행 중)

- ✅ DOMPromptBuilder (LLM 프롬프트 생성)
- 🔄 스크린샷 캡처 (html2canvas)
- 🔄 비전 모델 지원 (Claude 3, GPT-4V)

## 참고

자세한 설계 문서는 [PLAN.md](../../../PLAN.md)를 참조하세요.
