import { BaseElement } from '@iyulab/components/dist/components/BaseElement.js';
import {
  PresetWidget, PRESET_WIDGET_LIST, PRESET_DEFINITIONS,
  type WidgetDefinition,
  type WidgetSchema,
} from '../types/Widgets.js';

/**
 * 위젯 등록, LLM 인스트럭션 빌드, HTML 렌더링을 통합 제공하는 유틸리티
 */
export class WidgetRegistry {
  private static widgets = new Map<string, WidgetDefinition>();

  /**
   * 위젯 정의를 등록하거나 덮어씁니다. 같은 태그 커스텀 엘리먼트가 이미 등록되어 있으면 에러를 던집니다.
    * @throws {Error} 같은 태그의 커스텀 엘리먼트가 이미 등록된 경우
   */
  public static set(definition: WidgetDefinition): typeof WidgetRegistry {
    this.widgets.set(definition.name, definition);

    // 커스텀 엘리먼트 등록, 이미 등록된 태그가 있으면 덮어쓰지 않고 에러를 던집니다.
    if (customElements.get(definition.tag) && customElements.get(definition.tag) !== definition.element) {
      throw new Error(`Custom element with tag "${definition.tag}" is already defined.`);
    } else {
      if (definition.element.prototype instanceof BaseElement) {
        (definition.element as typeof BaseElement).define(definition.tag);
      } else {
        customElements.define(definition.tag, definition.element);
      }
    }

    return this;
  }

  /**
   * 위젯 정의를 등록합니다. 같은 이름의 위젯이 이미 등록되어 있으면 에러를 던집니다.
   * @throws {Error} 같은 이름의 위젯이 이미 등록된 경우
   */
  public static add(definition: WidgetDefinition): typeof WidgetRegistry {
    if (this.widgets.has(definition.name)) {
      throw new Error(`Widget with name "${definition.name}" is already registered.`);
    }

    return this.set(definition);
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
   * 등록된 위젯 정의를 이름으로 조회합니다.
   */
  public static has(name: string): boolean {
    return this.widgets.has(name);
  }

  /**
   * 등록된 위젯 정의를 이름으로 조회합니다.
   */
  public static get(name: string): WidgetDefinition | undefined {
    return this.widgets.get(name);
  }

  /**
   * 등록된 위젯 정의 전체를 반환합니다.
   */
  public static getAll(): WidgetDefinition[] {
    return Array.from(this.widgets.values());
  }

  /**
   * 이름으로 등록된 위젯 정의를 제거합니다. 제거 성공 여부를 반환합니다.
   */
  public static remove(name: string): boolean {
    return this.widgets.delete(name);
  }

  /**
   * 모든 등록된 위젯을 제거합니다.
   */
  public static clear(): void {
    this.widgets.clear();
  }

  /**
   * 등록된 위젯들에 대한 LLM 인스트럭션 문자열을 생성합니다.
   */
  public static buildPrompt(): string {
    if (this.widgets.size === 0) return '';

    const widgets = Array.from(this.widgets.values())

    const widgetList = widgets.map(w => {
        return `- \`${w.tag}\`: ${w.description}`; 
      })
      .join('\n');

    const widgetDocs = widgets.map(w => {
        const lines: string[] = [
          `### ${w.name}`,
          '',
          `**Tag:** \`${w.tag}\``,
        ];
        if (w.properties) {
          const schema = {
            type: 'object',
            properties: w.properties,
            ...(w.required ? { required: w.required } : {}),
          };
          lines.push(
            '',
            '**Properties (JSON Schema):**',
            '```json',
            JSON.stringify(schema, null, 2),
            '```',
          );
        }
        return lines.join('\n');
      })
      .join('\n\n---\n\n');

    return [
      '## Renderable Widgets',
      '',
      'You can render interactive visual widgets inside your response.',
      'When a widget would make your answer clearer or more useful, output a `widget-json` fenced code block.',
      '',
      '**Output format (the fence language must be `widget-json`):**',
      '```widget-json',
      '{',
      '  "tag": "exact-widget-tag-here",',
      '  "properties": {',
      '    "key": "value"',
      '  }',
      '}',
      '```',
      '',
      '**Rules — follow these strictly:**',
      '1. The fenced block language identifier must be `widget-json`, not `json` or anything else.',
      '2. `tag` must be one of the exact strings listed below. Never invent a tag.',
      '3. Include every property listed under `required`. Omit optional properties only if not needed.',
      '4. For schema-less `object` fields (e.g., Chart.js `data` / `options`), output a complete, realistic configuration using your knowledge.',
      '5. Output valid JSON — no comments, no trailing commas.',
      '',
      '**Available widgets:**',
      widgetList,
      '',
      '---',
      '',
      widgetDocs,
    ].join('\n');
  }

  /**
   * 위젯 데이터를 커스텀 엘리먼트 HTML 문자열로 변환합니다.
   * @param json widget-json 코드블록에서 파싱된 위젯 데이터
   */
  public static buildHTML(json: WidgetSchema): string {
    const tag = json.tag;
    const definition = Array.from(this.widgets.values()).find(w => w.tag === tag);
    if (!definition) {
      throw new Error(`Unregistered widget tag: ${tag}`);
    }

    const properties = json.properties ?? {};
    const attrs: string[] = [];

    for (const [key, value] of Object.entries(properties)) {
      if (value == null) continue;

      if (typeof value === 'object') {
        // 객체/배열은 JSON 직렬화하여 싱글쿼트로 감싸기
        attrs.push(`${key}='${this.escapeHTML(JSON.stringify(value))}'`);
      } else {
        attrs.push(`${key}="${this.escapeHTML(String(value))}"`);
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
