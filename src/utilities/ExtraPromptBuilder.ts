import template from '../assets/extra-prompt.md?raw';
import {
  PresetExtra, PRESET_EXTRA_LIST, PRESET_EXTRA_DEFINITIONS,
  type ExtraDefinition
} from '../types/Extras.js';

/**
 * Extra(부가 렌더링 블록) 등록, LLM 인스트럭션 빌드, HTML 렌더링을 통합 제공하는 유틸리티
 */
export class ExtraPromptBuilder {
  private static _instance: ExtraPromptBuilder;
  private extras = new Map<string, ExtraDefinition>();

  /**
   * 싱글톤 인스턴스를 반환합니다. 최초 호출 시 인스턴스가 생성됩니다.
   */
  public static get instance(): ExtraPromptBuilder {
    if (!this._instance) {
      this._instance = new ExtraPromptBuilder();
    }
    return this._instance;
  }

  /**
   * Extra 정의를 등록합니다. 같은 태그가 이미 등록되어 있으면 에러를 던집니다.
   * @throws {Error} 같은 태그가 이미 등록된 경우
   */
  public add(definition: ExtraDefinition): ExtraPromptBuilder {
    if (this.extras.has(definition.tag)) {
      throw new Error(`Extra with tag "${definition.tag}" is already registered.`);
    }

    this.extras.set(definition.tag, definition);
    return this;
  }

  /**
   * 미리 정의된 프리셋 Extra를 사용합니다.
   * @example
   * ExtraPromptBuilder.instance.use(PresetExtra.Images | PresetExtra.Chart);
   * ExtraPromptBuilder.instance.use(PresetExtra.All);
   */
  public use(flags: PresetExtra): ExtraPromptBuilder {
    for (const flag of PRESET_EXTRA_LIST) {
      // 플래그가 포함되어 있으면 해당 Extra를 등록합니다.
      if (flags & flag) {
        const definition = PRESET_EXTRA_DEFINITIONS.get(flag);
        if (definition) {
          this.add(definition);
        }
      }
    }
    return this;
  }

  /**
   * 등록된 Extra들에 대한 LLM 인스트럭션 문자열을 생성합니다.
   */
  public build(): string {
    if (this.extras.size === 0) return '';

    const defs = Array.from(this.extras.values());
    const docs = defs.map(def => {
        const lines: string[] = [
          `### ${def.tag}`,
          '',
          '**JSON Schema:**',
          '```block-json',
          JSON.stringify({
            type: 'object',
            description: def.description,
            properties: {
              tag: {
                type: 'string',
                enum: [def.tag]
              },
              properties: {
                type: 'object',
                properties: def.properties || {},
                required: def.required || []
              }
            },
            required: ['tag'],
          }, null, 2),
          '```',
        ];
        return lines.join('\n');
      })
      .join('\n\n---\n\n');

    return template.replace('{{EXTRA_DOCS}}', docs);
  }
}
