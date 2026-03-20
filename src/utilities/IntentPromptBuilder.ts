import template from '../assets/intent-prompt.md?raw';
import { 
  PRESET_INTENT_LIST, PRESET_INTENT_DEFINITIONS, PresetIntent,
  type IntentDefinition,
  type IntentSchema
} from "../types/Intents.js";

/**
 * Intent 등록, LLM 인스트럭션 빌드, 텍스트 추출을 통합 제공하는 유틸리티
 *
 * @example
 * IntentPromptBuilder.use(PresetIntent.All);
 * const prompt = IntentPromptBuilder.buildPrompt();
 * const [clean, templates] = IntentPromptBuilder.extractPrompt(llmText);
 */
export class IntentPromptBuilder {
  private static _instance: IntentPromptBuilder;
  private intents = new Map<string, IntentDefinition>();

  /**
   * 싱글톤 인스턴스를 반환합니다. 최초 호출 시 인스턴스가 생성됩니다.
   */
  public static get instance(): IntentPromptBuilder {
    if (!this._instance) {
      this._instance = new IntentPromptBuilder();
    }
    return this._instance;
  }

  /**
   * Intent 정의를 등록합니다. 같은 type이 이미 등록되어 있으면 에러를 던집니다.
   * @throws {Error} 같은 type의 intent가 이미 등록된 경우
   */
  public add(definition: IntentDefinition): IntentPromptBuilder {
    if (this.intents.has(definition.type)) {
      throw new Error(`Intent with type "${definition.type}" is already registered.`);
    }
    this.intents.set(definition.type, definition);
    return this;
  }

  /**
   * 미리 정의된 프리셋 Intent를 등록합니다.
   * @example
   * IntentPromptBuilder.use(PresetIntent.Questions);
   * IntentPromptBuilder.use(PresetIntent.All);
   */
  public use(flags: PresetIntent): IntentPromptBuilder {
    for (const flag of PRESET_INTENT_LIST) {
      if (flags & flag) {
        const definition = PRESET_INTENT_DEFINITIONS.get(flag);
        if (definition && !this.intents.has(definition.type)) {
          this.intents.set(definition.type, definition);
        }
      }
    }
    return this;
  }

  /**
   * 등록된 intent들에 대한 LLM 시스템 프롬프트 인스트럭션을 생성합니다.
   */
  public build(): string {
    if (this.intents.size === 0) return '';

    const defs = Array.from(this.intents.values());
    const docs = defs.map(def => {
      const lines: string[] = [
        `### ${def.type}`,
        '',
        '**JSON Schema:**',
        '```intent-json',
        JSON.stringify({
          type: 'object',
          description: def.description,
          properties: {
            type: {
              type: 'string',
              enum: [def.type]
            },
            properties: {
              type: 'object',
              properties: def.properties || {},
              required: def.required || []
            }
          },
          required: ['type'],
        }, null, 2),
        '```',
      ];
      return lines.join('\n');
    }).join('\n\n---\n\n');

    return template.replace('{{INTENT_DOCS}}', docs);
  }

  /**
   * LLM 응답 텍스트에서 `intent-json` 코드블록을 추출합니다.
   * 
   * @param value - LLM 응답 텍스트
   * @returns `[intents, rest]` — intents는 파싱된 JSON 객체 배열, rest는 블록이 제거된 나머지 텍스트
   */
  public parse(value: string): [IntentSchema[], string] {
    const pattern = /```(?:intent-json)\s*([\s\S]*?)```/g;
    const intents: IntentSchema[] = [];
    const rest = value.replace(pattern, (_, json) => {
      try {
        intents.push(JSON.parse(json.trim()));
      } catch {
        // 유효하지 않은 JSON은 무시
      }
      return '';
    }).trim();
    return [intents, rest];
  }
}
