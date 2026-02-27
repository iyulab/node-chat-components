import { type ActionBlockItem } from '../types/BlockItem.js';
import { type JsonSchema } from '../types/JsonSchema.js';

/**
 * Action 정의 구조체
 */
export interface ActionDefinition {
  /** action 식별자 (action-json의 "type" 필드와 매칭) */
  type: string;
  /** LLM용 설명 */
  description: string;
  /** LLM용 속성 스키마 */
  schema?: Record<string, JsonSchema>;
  /** 추출된 JSON → ActionBlockItem 변환 */
  parse(json: Record<string, unknown>): ActionBlockItem | null;
}

/**
 * 프리셋 Action 비트 플래그
 */
export enum PresetAction {
  Questions = 1 << 0,
  All       = Questions
}

const PRESET_ACTION_LIST = [
  PresetAction.Questions,
] as const;

const PRESET_DEFINITIONS = new Map<PresetAction, ActionDefinition>([
  [
    PresetAction.Questions,
    {
      type: 'questions',
      description: 'Suggest follow-up questions the user can click to send as their next message',
      schema: {
        values: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          maxItems: 10,
          description: 'List of suggested questions (1–10 items)',
          examples: [['What are the main differences?', 'Can you show me an example?', 'What should I learn next?']],
        } as any,
      },
      parse(json) {
        if (!Array.isArray(json['values'])) return null;
        const values = (json['values'] as unknown[]).filter(v => typeof v === 'string') as string[];
        if (values.length === 0) return null;
        return { type: 'questions', values };
      },
    }
  ],
]);

/**
 * Action 등록, LLM 인스트럭션 빌드, 텍스트 추출을 통합 제공하는 유틸리티
 *
 * @example
 * ActionRegistry.use(PresetAction.All);
 * const prompt = ActionRegistry.buildPrompt();
 * const [clean, actions] = ActionRegistry.extractPrompt(llmText);
 */
export class ActionRegistry {
  private static actions = new Map<string, ActionDefinition>();

  /**
   * Action 정의를 등록합니다. 같은 type이 이미 등록되어 있으면 에러를 던집니다.
   * @throws {Error} 같은 type의 action이 이미 등록된 경우
   */
  public static add(definition: ActionDefinition): typeof ActionRegistry {
    if (this.actions.has(definition.type)) {
      throw new Error(`Action with type "${definition.type}" is already registered.`);
    }
    this.actions.set(definition.type, definition);
    return this;
  }

  /**
   * 미리 정의된 프리셋 Action을 등록합니다.
   * @example
   * ActionRegistry.use(PresetAction.Questions);
   * ActionRegistry.use(PresetAction.All);
   */
  public static use(flags: PresetAction): typeof ActionRegistry {
    for (const flag of PRESET_ACTION_LIST) {
      if (flags & flag) {
        const definition = PRESET_DEFINITIONS.get(flag);
        if (definition && !this.actions.has(definition.type)) {
          this.actions.set(definition.type, definition);
        }
      }
    }
    return this;
  }

  /**
   * 등록된 action 전체를 제거합니다.
   */
  public static clear(): void {
    this.actions.clear();
  }

  /**
   * 등록된 action이 있는지 여부를 반환합니다.
   */
  public static isEmpty(): boolean {
    return this.actions.size === 0;
  }

  /**
   * 등록된 action들에 대한 LLM 시스템 프롬프트 인스트럭션을 생성합니다.
   */
  public static buildPrompt(): string {
    if (this.actions.size === 0) return '';

    const defs = Array.from(this.actions.values());

    const actionDocs = defs.map(def => {
      const lines: string[] = [
        `### ${def.type}`,
        '',
        def.description,
      ];
      if (def.schema) {
        const exampleObj: Record<string, unknown> = { type: def.type };
        for (const [key, schema] of Object.entries(def.schema)) {
          exampleObj[key] = (schema as any).examples?.[0]
            ?? (schema as any).type === 'array' ? ['example item'] : 'example value';
        }
        lines.push(
          '',
          '**Format:**',
          '```action-json',
          JSON.stringify(exampleObj, null, 2),
          '```',
        );
      }
      return lines.join('\n');
    }).join('\n\n---\n\n');

    return [
      '## Interactive Actions',
      '',
      'You can guide the user with interactive actions by appending `action-json` fenced code blocks at the end of your response.',
      'The user will see these as interactive UI elements and can click them to continue the conversation.',
      '',
      '**Output format (the fence language must be `action-json`):**',
      '```action-json',
      '{',
      '  "type": "action-type-here",',
      '  "key": "value"',
      '}',
      '```',
      '',
      '**Rules — follow these STRICTLY. Violation means the feature will not work:**',
      '1. ALWAYS wrap the block in triple backticks with the language identifier `action-json` exactly — never use `json`, plain text, or any other identifier.',
      '2. `type` must be one of the exact strings listed below. Do not invent new types.',
      '3. Place ALL action blocks at the very end of your response, after all prose content.',
      '4. Output valid JSON only — no comments, no trailing commas, no markdown inside the block.',
      '5. Only include actions when they genuinely help the user continue the conversation.',
      '6. Do NOT describe or explain the action block in surrounding text (e.g. do not write "Here are some suggested questions:"). Just output the block.',
      '',
      '**Available actions:**',
      defs.map(d => `- \`${d.type}\`: ${d.description}`).join('\n'),
      '',
      '---',
      '',
      actionDocs,
    ].join('\n');
  }

  /**
   * LLM 응답 텍스트에서 action-json 블록을 추출하고 블록을 제거한 나머지를 반환합니다.
   * @param markdown LLM 응답 원본 텍스트
   * @returns [cleanMarkdown, parsedActionItems]
   */
  public static extractPrompt(markdown: string): [string, ActionBlockItem[]] {
    if (this.actions.size === 0) return [markdown, []];

    const ACTION_BLOCK_RE = /```action-json\r?\n([\s\S]*?)```/g;
    const items: ActionBlockItem[] = [];

    const clean = markdown.replace(ACTION_BLOCK_RE, (_, jsonStr: string) => {
      try {
        const json = JSON.parse(jsonStr.trim()) as Record<string, unknown>;
        const def = this.actions.get(json['type'] as string);
        const item = def?.parse(json);
        if (item) items.push(item);
      } catch (e) {
        console.warn('[ActionRegistry] extractPrompt parse error:', e);
      }
      return '';
    }).trim();

    return [clean, items];
  }
}
