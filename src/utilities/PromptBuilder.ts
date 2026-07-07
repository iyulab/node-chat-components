import template from '../assets/prompts/element-prompt.md?raw';
import { type ElementSchema } from '../types/Schema.js';

/**
 * Element(부가 렌더링 블록) 등록, LLM 인스트럭션 빌드, HTML 렌더링을 통합 제공하는 유틸리티
 */
export class ElementPromptBuilder {
  private static _instance: ElementPromptBuilder;
  private elements = new Map<string, ElementSchema>();

  /**
   * 싱글톤 인스턴스를 반환합니다. 최초 호출 시 인스턴스가 생성됩니다.
   */
  public static get instance(): ElementPromptBuilder {
    if (!this._instance) {
      this._instance = new ElementPromptBuilder();
    }
    return this._instance;
  }

  /**
   * Element 정의를 등록합니다. 같은 태그가 이미 등록되어 있으면 에러를 던집니다.
   * @throws {Error} 같은 태그가 이미 등록된 경우
   */
  public add(schema: ElementSchema): ElementPromptBuilder {
    if (this.elements.has(schema.tag)) {
      throw new Error(`Element with tag "${schema.tag}" is already registered.`);
    }

    this.elements.set(schema.tag, schema);
    return this;
  }

  /**
   * 등록된 Element들에 대한 LLM 인스트럭션 문자열을 생성합니다.
   */
  public build(): string {
    if (this.elements.size === 0) return '';

    const defs = Array.from(this.elements.values());
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
