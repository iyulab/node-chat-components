import { html, PropertyValues, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';

import { BaseElement } from '../../internal/BaseElement';
import { jsonConverter, isValueType, getNodeName } from './JsonViewer.handlers.js';
import type { JsonNode, JsonValue, JsonArray, JsonObject } from './JsonViewer.types.js';
import { styles } from './JsonViewer.styles.js';

/**
 * json 데이터를 트리 형태로 시각화하는 컴포넌트입니다.
 */
export class JsonViewer extends BaseElement {
  static styles = [ super.styles, styles ];
  static dependencies: Record<string, typeof BaseElement> = {};

  @state() state: Record<string, boolean> = {};

  /** 초기 확장 상태를 관리하는 속성입니다. */
  @property({ type: Boolean }) expanded: boolean = true;
  /** JSON 데이터 (속성으로 전달 가능) */
  @property({ type: Object, converter: jsonConverter }) value: JsonNode = {};

  connectedCallback() {
    this.setAttribute('tabindex', '0');
    this.setAttribute('role', 'node');
    super.connectedCallback();
  }

  protected willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has('value') || changedProperties.has('expanded')) {
      this.state = this.setState(this.value);
    }
  }

  render() {
    return html`
      <div part="base">
        ${this.renderNode(this.value)}
      </div>
    `;
  }

  /**
   * JsonNode를 렌더링합니다.
   * @param value - JsonNode (JsonObject, JsonArray, 또는 JsonValue)
   * @param parent - 부모 노드의 경로
   */
  private renderNode(value: JsonNode, parent: string = ''): TemplateResult {
    return isValueType(value)
      ? this.renderValue(value as JsonValue)
      : this.renderObject(value as JsonObject | JsonArray, parent);
  }

  /**
   * JsonValue를 렌더링합니다.
   * @param node - JsonValue (string, number, boolean, null 등)
   */
  private renderValue(node: JsonValue): TemplateResult {
    const type = getNodeName(node);
    return html`
      <span part="${type}" class="${type}" role="treeitem">
        ${JSON.stringify(node)}
      </span>
    `;
  }

  /**
   * JsonObject 또는 JsonArray를 렌더링합니다.
   * @param node - JsonObject 또는 JsonArray
   * @param depth - 현재 깊이
   */
  private renderObject(node: JsonObject | JsonArray, parent: string): TemplateResult {
    return html`
      <ul part="object" role="group">
        ${map(Object.entries(node), ([key, value]) => {
          const path = parent ? `${parent}.${key}` : key;
          const isValue = isValueType(value);
          const isExpanded = this.state[path] ?? this.expanded;

          return html`
            <li part="property" role="treeitem"
                data-path="${path}"
                aria-expanded="${isExpanded ? 'true' : 'false'}">
              <span part="key"
                    class="key"
                    ?collapsable="${!isValue}"
                    ?collapsed="${!isValue && !isExpanded}"
                    @click=${!isValue ? () => this.toggle(path) : null}>
                ${key}:
                ${when(!isValue && !isExpanded,() => this.renderPreview(value as any))}
              </span>

              ${when(isValue || isExpanded, () => this.renderNode(value, path))}
            </li>`})}
      </ul>
    `;
  }

  /**
   * 노드의 미리보기를 렌더링합니다.
   * @param node - JsonObject 또는 JsonArray
   */
  private renderPreview(node: JsonObject | JsonArray): TemplateResult {
    return html`
      <span part="preview" class="preview">
        ${Array.isArray(node)
          ? (node.length === 0 ? '[ ]' : `[ ${node.length} items ]`)
          : (Object.keys(node).length === 0 ? '{ }' : `{ ${Object.keys(node).length} properties }`)}
      </span>
    `;
  }

  /** 노드 확장/축소 클릭 핸들러 */
  private toggle(path: string) {
    const isExpanded = this.state[path] ?? false;
    this.state = {...this.state, [path]: !isExpanded };
  }

  /** JSON 데이터를 순회하며 각 경로의 확장 상태를 설정합니다. */
  private setState(value: JsonNode, parent: string = '') : Record<string, boolean> {
    if (typeof value !== 'object' || value === null) return {};

    const state: Record<string, boolean> = {};
    Object.entries(value).forEach(([key, item]) => {
      const path = parent ? `${parent}.${key}` : key;
      state[path] = this.expanded;
      Object.assign(state, this.setState(item, path));
    });
    return state;
  }
}
