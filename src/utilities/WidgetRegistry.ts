import { BaseElement } from '@iyulab/components/dist/components/BaseElement.js';
import {
  PresetWidget, PRESET_WIDGET_LIST, PRESET_DEFINITIONS,
  type WidgetDefinition
} from '../types/Widgets.js';

/**
 * 위젯 등록, LLM 인스트럭션 빌드, HTML 렌더링을 통합 제공하는 유틸리티
 */
export class WidgetRegistry {
  private static widgets = new Map<string, WidgetDefinition>();

  /**
   * 커스텀 위젯을 추가합니다.
   */
  public static add(definition: WidgetDefinition): typeof WidgetRegistry {
    // 위젯 이름이 이미 등록되어 있다면 덮어쓰지 않고 경고 메시지만 출력합니다.
    this.widgets.set(definition.name, definition);
    
    // 커스텀 엘리먼트가 아직 등록되지 않았다면 등록합니다.
    if (!customElements.get(definition.tag)) {
      if (definition.element.prototype instanceof BaseElement) {
        (definition.element as typeof BaseElement).define(definition.tag);
      } else {
        customElements.define(definition.tag, definition.element);
      }
    }

    return this;
  }

  /**
   * 미리 정의된 프리셋 위젯을 사용합니다.
   * @example
   * WidgetRegistry.use(Widget.Images | Widget.Chart);
   * WidgetRegistry.use(Widget.All);
   */
  public static use(flags: PresetWidget): typeof WidgetRegistry {
    for (const flag of PRESET_WIDGET_LIST) {
      // 플래그가 포함되어 있으면 해당 위젯을 등록합니다.
      if (flags & flag) {
        const definition = PRESET_DEFINITIONS.get(flag);
        if (definition) {
          this.add(definition);
        }
      }
    }
    return this;
  }

  /**
   * 등록된 모든 위젯을 제거합니다.
   */
  public static reset(): typeof WidgetRegistry {
    this.widgets.clear();
    return this;
  }

  /**
   * 등록된 위젯들에 대한 LLM 인스트럭션 문자열을 생성합니다.
   */
  public static buildPrompt(): string {
    if (this.widgets.size === 0) return '';

    const widgets = Array.from(this.widgets.values());

    let prompt = '## Available Widgets\n\n';
    prompt += 'You can use the following widgets in your responses by including them as code blocks with the `widget-json` language tag:\n\n';

    for (const widget of widgets) {
      prompt += `### ${widget.name}\n`;
      prompt += `${widget.description}\n\n`;
      prompt += '**Example:**\n';
      prompt += '```widget-json\n';
      prompt += JSON.stringify(widget.example, null, 2) + '\n';
      prompt += '```\n';
    }

    prompt += '**Important Notes:**\n';
    prompt += '- Always use `widget-json` as the language tag for widget code blocks\n';
    prompt += '- Ensure the JSON is valid and follows the schema for each widget type\n';
    prompt += '- Widgets will be rendered directly in the chat interface\n';

    return prompt;
  }

  /**
   * 위젯 데이터를 커스텀 엘리먼트 HTML 문자열로 변환합니다.
   * @param json widget-json 코드블록에서 파싱된 위젯 데이터
   */
  public static buildHTML(json: Record<string, unknown>): string {
    const typeName = json.type as string;
    const definition = this.widgets.get(typeName);
    if (!definition) {
      throw new Error(`Unregistered widget type: ${typeName}`);
    }
    
    const attrs: string[] = [];

    for (const [key, mapping] of Object.entries(definition.attrs)) {
      const value = json[key];
      if (value == null) continue;

      const name = mapping.attr ?? key;
      if (mapping.json) {
        attrs.push(`${name}='${this.escapeHTML(JSON.stringify(value))}'`);
      } else {
        attrs.push(`${name}="${this.escapeHTML(String(value))}"`);
      }
    }

    const attrStr = attrs.length ? ` ${attrs.join(' ')}` : '';
    return `<${definition.tag}${attrStr}></${definition.tag}>`;
  }

  /**
   * HTML 특수문자 이스케이프
   */
  private static escapeHTML(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
