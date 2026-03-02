import template from '../assets/widget-prompt.md?raw';
import { UElement } from '@iyulab/components/dist/components/UElement.js';
import {
  PresetWidget, PRESET_WIDGET_LIST, PRESET_WIDGET_DEFINITIONS,
  type WidgetDefinition
} from '../types/Widgets.js';

/**
 * 위젯 등록, LLM 인스트럭션 빌드, HTML 렌더링을 통합 제공하는 유틸리티
 */
export class WidgetPromptBuilder {
  private static _instance: WidgetPromptBuilder;
  private widgets = new Map<string, WidgetDefinition>();

  /**
   * 싱글톤 인스턴스를 반환합니다. 최초 호출 시 인스턴스가 생성됩니다.
   */
  public static get instance(): WidgetPromptBuilder {
    if (!this._instance) {
      this._instance = new WidgetPromptBuilder();
    }
    return this._instance;
  }

  /**
   * 위젯 정의를 등록합니다. 같은 이름의 위젯이 이미 등록되어 있으면 에러를 던집니다.
   * @throws {Error} 같은 이름의 위젯이 이미 등록된 경우 또는 같은 태그의 커스텀 요소가 다른 클래스에 의해 정의된 경우
   */
  public add(definition: WidgetDefinition): WidgetPromptBuilder {
    // 같은 이름의 위젯이 이미 등록되어 있으면 에러를 던집니다.
    if (this.widgets.has(definition.tag)) {
      throw new Error(`Widget with tag "${definition.tag}" is already registered.`);
    }
    
    // 커스텀 요소가 이미 정의되어 있으면, 같은 클래스인지 확인합니다. 다른 클래스라면 에러를 던집니다.
    const constructor = customElements.get(definition.tag);
    if (constructor && constructor !== definition.element) {
      throw new Error(`Custom element with tag "${definition.tag}" is already defined to a different class.`);
    }

    // 요소가 UElement을 상속받는 경우, UElement 방식으로 정의합니다. 그렇지 않으면 일반 customElements.define을 사용합니다.
    if (definition.element.prototype instanceof UElement) {
      (definition.element as typeof UElement).define(definition.tag);
    } else {
      customElements.define(definition.tag, definition.element);
    }

    // 등록된 위젯 정보를 저장합니다.
    this.widgets.set(definition.tag, definition);
    return this;
  }

  /**
   * 미리 정의된 프리셋 위젯을 사용합니다.
   * @example
   * WidgetRegistry.use(Widget.Images | Widget.Chart);
   * WidgetRegistry.use(Widget.All);
   */
  public use(flags: PresetWidget): WidgetPromptBuilder {
    for (const flag of PRESET_WIDGET_LIST) {
      // 플래그가 포함되어 있으면 해당 위젯을 등록합니다.
      if (flags & flag) {
        const definition = PRESET_WIDGET_DEFINITIONS.get(flag);
        if (definition) {
          this.add(definition);
        }
      }
    }
    return this;
  }

  /**
   * 등록된 위젯들에 대한 LLM 인스트럭션 문자열을 생성합니다.
   */
  public build(): string {
    if (this.widgets.size === 0) return '';

    const widgets = Array.from(this.widgets.values());

    const widgetList = widgets
      .map(w => `- \`${w.tag}\`: ${w.description}`)
      .join('\n');

    const widgetDocs = widgets.map(w => {
        const lines: string[] = [
          `### ${w.tag}`,
          '',
          `**Tag:** \`${w.tag}\``,
        ];
        if (w.properties) {
          lines.push(
            '',
            '**Properties (JSON Schema):**',
            '```json',
            JSON.stringify({
              type: 'object',
              properties: w.properties,
              ...(w.required ? { required: w.required } : {}),
            }, null, 2),
            '```',
          );
        }
        return lines.join('\n');
      })
      .join('\n\n---\n\n');

    return template
      .replace('{{WIDGET_LIST}}', widgetList)
      .replace('{{WIDGET_DOCS}}', widgetDocs);
  }
}
