# Action 시스템 구현 플랜

## 핵심 아이디어

LLM 응답에서 `action-json` 코드블록을 **프로그램적으로 분리**하여,
- 나머지 텍스트 → assistant 메시지 아이템 (markdown, 원본에서 블록 제거)
- 추출된 actions → **별도 `role: 'action'` 메시지**로 user 측에 렌더링

유저가 인터랙션하면 해당 action 메시지를 제거 후 user 텍스트 메시지로 교체 → LLM 재호출.
LLM 컨텍스트 전송 시 `role: 'action'` 메시지는 항상 제외.

---

## 전체 플로우

```
[1] LLM instruction에 action 사용법 포함 (ActionRegistry.buildPrompt())

[2] LLM 스트리밍 응답
    "서울의 날씨는 맑습니다. ...
     ```action-json
     { "type": "questions", "values": ["더 알고싶어요", "다른 도시는?"] }
     ```"

[3] 스트리밍 완료 후 ActionRegistry.extractPrompt(fullText) 호출
    → [cleanMarkdown, [{ type: "questions", values: [...] }]]

[4] 메시지 재구성
    - assistant 메시지 markdown item.value = cleanMarkdown  (action-json 제거됨)
    - 새 메시지 추가: role: 'action', items = [{ type: "questions", values: [...] }]

[5] 렌더링
    - assistant 메시지: 기존 그대로 (u-marked-block 등)
    - action 메시지: user 측 위치에 표시, u-questions-block 렌더

[6] 유저가 질문 선택
    - u-questions-block → emit('query', { value })
    - action 메시지 제거
    - 새 user 메시지 { type: 'text', value } 추가

[7] LLM 재호출 (action 메시지는 컨텍스트에서 항상 제외)
```

---

## 메시지 구조 변경

### 새 role 추가: `'action'`

```typescript
// tests/messages.ts (앱 레벨)
export interface ActionMessage {
  role: 'action';   // user 측에 렌더, LLM 컨텍스트에서 항상 제외
  id: string;
  items: ActionBlockItem[];
}

export type Message = UserMessage | AssistantMessage | ActionMessage;
```

### BlockItem 확장

```typescript
// types/BlockItem.ts

/** 질문 제안 액션 블록 */
export interface QuestionsActionBlockItem {
  type: "questions";
  values: string[];
}

// 향후 확장 예시
// export interface DomClickActionBlockItem {
//   type: "dom-click";
//   target: string;
//   label: string;
// }

export type ActionBlockItem = QuestionsActionBlockItem; // | DomClickActionBlockItem | ...

export type BlockItem = (
  ThinkingBlockItem |
  TextBlockItem |
  MarkdownBlockItem |
  ToolBlockItem |
  ReferenceBlockItem |
  QuestionsActionBlockItem  // action 아이템도 BlockItem에 포함
);
```

---

## ActionRegistry 설계

`WidgetRegistry`와 동일한 패턴으로 구성.

```typescript
// utilities/ActionRegistry.ts

export interface ActionDefinition {
  type: string;
  description: string;
  schema?: Record<string, JsonSchema>;
  /** 추출된 JSON → ActionBlockItem 변환 */
  parse(json: Record<string, unknown>): ActionBlockItem | null;
}

export class ActionRegistry {
  private static actions = new Map<string, ActionDefinition>();

  /** action 등록 */
  static add(def: ActionDefinition): typeof ActionRegistry

  /**
   * LLM 시스템 프롬프트에 삽입할 action 사용법 instruction 빌드
   * 예시 출력:
   * "You can guide the user with action-json code blocks at the end of your response:
   *  ```action-json
   *  { "type": "questions", "values": ["질문1", "질문2"] }
   *  ```
   *  ..."
   */
  static buildPrompt(): string

  /**
   * LLM 응답 텍스트에서 action-json 블록을 추출하고 제거
   * @returns [cleanMarkdown, parsedActionItems]
   */
  static extractPrompt(markdown: string): [string, ActionBlockItem[]]
}
```

### extractPrompt 구현 핵심

```typescript
static extractPrompt(markdown: string): [string, ActionBlockItem[]] {
  const ACTION_BLOCK_RE = /```action-json\n([\s\S]*?)```/g;
  const actions: ActionBlockItem[] = [];

  const clean = markdown.replace(ACTION_BLOCK_RE, (_, jsonStr) => {
    try {
      const json = JSON.parse(jsonStr.trim());
      const def = this.actions.get(json.type);
      const item = def?.parse(json);
      if (item) actions.push(item);
    } catch { /* 파싱 실패 무시 */ }
    return '';  // 블록 제거
  }).trim();

  return [clean, actions];
}
```

---

## 프리셋 Action 등록 (PresetAction)

```typescript
export enum PresetAction {
  Questions = 1 << 0,
  // DomClick = 1 << 1,  // 향후
  All = Questions
}

// Questions action 정의
{
  type: 'questions',
  description: 'Suggest follow-up questions the user can click to ask',
  schema: {
    values: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 10 }
  },
  parse(json) {
    if (!Array.isArray(json.values)) return null;
    return { type: 'questions', values: json.values as string[] };
  }
}
```

---

## 렌더링 (앱 레벨)

`role: 'action'` 메시지는 user 위치(right)에 렌더링하되 LLM에 전송하지 않음.

```typescript
// preview.ts renderMessage 분기
msg.role === 'action'
  ? html`
    <u-message variant="bubble" position="right">
      ${msg.items.map(item =>
        item.type === 'questions'
          ? html`<u-questions-block
                   .values=${item.values}
                   @query=${(e) => this.handleQuery(e, msg.id)}>
                 </u-questions-block>`
          : nothing
      )}
    </u-message>`
```

### handleQuery

```typescript
private handleQuery(e: CustomEvent, actionMsgId: string) {
  const { value } = e.detail;

  // 1. action 메시지 제거
  this.messages = this.messages.filter(m => m.id !== actionMsgId);

  // 2. user 텍스트 메시지 추가
  this.messages = [...this.messages, {
    id: generateRandomId(),
    role: 'user',
    items: [{ type: 'text', value }]
  }];

  // 3. LLM 재호출 (role: 'action'은 이미 제거됨)
  this.streamAssistant(this.messages);
}
```

---

## 스트리밍 완료 후 처리

```typescript
private async streamAssistant(userMessages: Message[]) {
  const stream = generateMessageStream(userMessages, this.aborter.signal);
  for await (const message of stream) {
    this.messages = [...userMessages, message];
    this.requestUpdate();
  }

  // 스트리밍 완료 → action-json 추출
  const lastMsg = this.messages[this.messages.length - 1];
  if (lastMsg?.role === 'assistant') {
    const markdownItem = lastMsg.items.find(i => i.type === 'markdown');
    if (markdownItem?.value) {
      const [clean, actions] = ActionRegistry.extractPrompt(markdownItem.value);

      // assistant 메시지에서 action-json 제거
      markdownItem.value = clean;

      // action 메시지 추가
      if (actions.length > 0) {
        this.messages = [...this.messages, {
          id: generateRandomId(),
          role: 'action',
          items: actions
        }];
      }
      this.requestUpdate();
    }
  }
}
```

---

## LLM 컨텍스트 필터링

`generateMessageStream` 내부에서 `role: 'action'` 메시지 항상 제외:

```typescript
// generator.ts
const input = messages
  .filter(msg => msg.role === 'user' || msg.role === 'assistant')
  .reduce<ResponseInput>(...)
```

---

## action-json 포맷 (LLM 인스트럭션)

```json
{ "type": "questions", "values": ["AI 기술의 미래는?", "프로그래밍 언어 추천해줘"] }
```

---

## 파일별 작업 목록

| 파일 | 작업 |
|------|------|
| `src/types/BlockItem.ts` | `QuestionsActionBlockItem`, `ActionBlockItem` 타입 추가 |
| `src/utilities/ActionRegistry.ts` | **신규** - `add`, `use`, `buildPrompt`, `extractPrompt`, `PresetAction` |
| `src/index.ts` | `ActionRegistry`, `PresetAction` export 추가 |
| `tests/messages.ts` | `ActionMessage` 타입 추가, `Message` union 확장 |
| `tests/preview.ts` | `role: 'action'` 렌더링, `handleQuery`, `streamAssistant` 수정 |
| `tests/generator.ts` | `role: 'action'` 컨텍스트 필터링 |

---

## 미결 사항

1. 스트리밍 **도중** stream을 보고 action-json이 시작되면 파싱 전이므로 그냥 텍스트로 보임 → 완료 후 처리이므로 문제 없음
2. action 메시지는 영속화 불필요 (새로고침 시 사라져도 자연스러움)
3. 한 응답에 여러 action-json 블록이 있을 경우 모두 하나의 action 메시지 items에 합산
