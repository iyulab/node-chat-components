import template from '../assets/view-prompt.md?raw';
import {
  PresetView, PRESET_VIEW_LIST, PRESET_VIEW_DEFINITIONS,
  type ViewDefinition
} from '../types/Views.js';

/**
 * 뷰 등록, LLM 인스트럭션 빌드, HTML 렌더링을 통합 제공하는 유틸리티
 */
export class ViewPromptBuilder {
  private static _instance: ViewPromptBuilder;
  private views = new Map<string, ViewDefinition>();

  /**
   * 싱글톤 인스턴스를 반환합니다. 최초 호출 시 인스턴스가 생성됩니다.
   */
  public static get instance(): ViewPromptBuilder {
    if (!this._instance) {
      this._instance = new ViewPromptBuilder();
    }
    return this._instance;
  }

  /**
   * 뷰 정의를 등록합니다. 같은 이름의 뷰이 이미 등록되어 있으면 에러를 던집니다.
   * @throws {Error} 같은 이름의 뷰이 이미 등록된 경우 또는 같은 태그의 커스텀 요소가 다른 클래스에 의해 정의된 경우
   */
  public add(definition: ViewDefinition): ViewPromptBuilder {
    // 같은 이름의 뷰이 이미 등록되어 있으면 에러를 던집니다.
    if (this.views.has(definition.tag)) {
      throw new Error(`View with tag "${definition.tag}" is already registered.`);
    }
    
    // 커스텀 요소가 이미 정의되어 있으면, 같은 클래스인지 확인합니다. 다른 클래스라면 에러를 던집니다.
    const constructor = customElements.get(definition.tag);
    if (constructor && constructor !== definition.element) {
      throw new Error(`Custom element with tag "${definition.tag}" is already defined to a different class.`);
    }

    // 등록된 뷰 정보를 저장합니다.
    this.views.set(definition.tag, definition);
    return this;
  }

  /**
   * 미리 정의된 프리셋 뷰을 사용합니다.
   * @example
   * ViewRegistry.use(View.Images | View.Chart);
   * ViewRegistry.use(View.All);
   */
  public use(flags: PresetView): ViewPromptBuilder {
    for (const flag of PRESET_VIEW_LIST) {
      // 플래그가 포함되어 있으면 해당 뷰을 등록합니다.
      if (flags & flag) {
        const definition = PRESET_VIEW_DEFINITIONS.get(flag);
        if (definition) {
          this.add(definition);
        }
      }
    }
    return this;
  }

  /**
   * 등록된 뷰들에 대한 LLM 인스트럭션 문자열을 생성합니다.
   */
  public build(): string {
    if (this.views.size === 0) return '';

    const defs = Array.from(this.views.values());
    const docs = defs.map(def => {
        const lines: string[] = [
          `### ${def.tag}`,
          '',
          '**JSON Schema:**',
          '```view-json',
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

    return template.replace('{{VIEW_DOCS}}', docs);
  }
}
