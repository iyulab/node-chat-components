import template from '../assets/action-prompt.md?raw';
import { 
  PRESET_ACTION_LIST, PRESET_ACTION_DEFINITIONS, PresetAction,
  type ActionDefinition,
  type ActionSchema
} from "../types/Actions.js";

/**
 * Action 등록, LLM 인스트럭션 빌드, 텍스트 추출을 통합 제공하는 유틸리티
 *
 * @example
 * ActionPromptBuilder.use(PresetAction.All);
 * const prompt = ActionPromptBuilder.buildPrompt();
 * const [clean, templates] = ActionPromptBuilder.extractPrompt(llmText);
 */
export class ActionPromptBuilder {
  private static _instance: ActionPromptBuilder;
  private actions = new Map<string, ActionDefinition>();

  /**
   * 싱글톤 인스턴스를 반환합니다. 최초 호출 시 인스턴스가 생성됩니다.
   */
  public static get instance(): ActionPromptBuilder {
    if (!this._instance) {
      this._instance = new ActionPromptBuilder();
    }
    return this._instance;
  }

  /**
   * Action 정의를 등록합니다. 같은 type이 이미 등록되어 있으면 에러를 던집니다.
   * @throws {Error} 같은 type의 action이 이미 등록된 경우
   */
  public add(definition: ActionDefinition): ActionPromptBuilder {
    if (this.actions.has(definition.type)) {
      throw new Error(`Action with type "${definition.type}" is already registered.`);
    }
    this.actions.set(definition.type, definition);
    return this;
  }

  /**
   * 미리 정의된 프리셋 Action을 등록합니다.
   * @example
   * ActionPromptBuilder.use(PresetAction.Questions);
   * ActionPromptBuilder.use(PresetAction.All);
   */
  public use(flags: PresetAction): ActionPromptBuilder {
    for (const flag of PRESET_ACTION_LIST) {
      if (flags & flag) {
        const definition = PRESET_ACTION_DEFINITIONS.get(flag);
        if (definition && !this.actions.has(definition.type)) {
          this.actions.set(definition.type, definition);
        }
      }
    }
    return this;
  }

  /**
   * 등록된 action들에 대한 LLM 시스템 프롬프트 인스트럭션을 생성합니다.
   */
  public build(): string {
    if (this.actions.size === 0) return '';

    const defs = Array.from(this.actions.values());
    const docs = defs.map(def => {
      const lines: string[] = [
        `### ${def.type}`,
        '',
        '**JSON Schema:**',
        '```action-json',
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

    return template.replace('{{ACTION_DOCS}}', docs);
  }

  /**
   * LLM 응답 텍스트에서 `action-json` 코드블록을 추출합니다.
   * 
   * @param value - LLM 응답 텍스트
   * @returns `[actions, rest]` — actions는 파싱된 JSON 객체 배열, rest는 블록이 제거된 나머지 텍스트
   */
  public parse(value: string): [ActionSchema[], string] {
    const pattern = /```action-json\s*([\s\S]*?)```/g;
    const actions: ActionSchema[] = [];
    const rest = value.replace(pattern, (_, json) => {
      try {
        actions.push(JSON.parse(json.trim()));
      } catch {
        // 유효하지 않은 JSON은 무시
      }
      return '';
    }).trim();
    return [actions, rest];
  }
}
