import { html, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "@iyulab/components/dist/components/skeleton/USkeleton.js";
import { UDataElement } from "../UDataElement.js";
import { getElementBlockProperties } from "../../utilities/ElementRegistry.js";

import { styles } from "./UElementBlock.styles.js";

/**
 * `block-json` 코드펜스에서 지정한 블록을 동적으로 렌더링하는 컴포넌트입니다.
 *
 * 만들 수 있는 것은 **블록으로 등록된 태그뿐**이고(`registerElementBlock` ·
 * `ElementPromptBuilder.add`), 대입하는 것은 **그 스키마의 `properties` 에 적힌 이름뿐**입니다.
 * `tag`·`properties` 는 LLM 출력에서 오므로 신뢰할 수 없는 입력으로 다룹니다 — 스키마 밖의
 * 이름은 대입하지 않고 콘솔에 기록합니다.
 * 대상 태그가 등록되어 있지 않거나 데이터가 유효하지 않은 경우, 에러 카드 없이 콘솔에만 기록하고 아무것도 렌더링하지 않습니다.
 */
@customElement('u-element-block')
export class UElementBlock extends UDataElement {
  static styles = [super.styles, styles];

  /** 로딩 상태입니다. `true`인 경우, 위젯이 로딩 중임을 나타냅니다. */
  @property({ type: Boolean, reflect: true }) loading = false;
  /** 렌더링할 블록의 태그입니다. 블록으로 등록된 태그만 렌더링됩니다. */
  @property({ type: String }) tag?: string;
  /** 블록에 대입할 값입니다. 블록 스키마의 `properties` 에 적힌 이름만 대입됩니다. */
  @property({ type: Object }) properties?: Record<string, unknown>;

  /** 실제 렌더링된 엘리먼트입니다. `tag` 프로퍼티가 변경될 때마다 업데이트됩니다. */
  @state() private element: HTMLElement | null = null;

  protected willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("tag")) {
      this.updateElement(this.tag);
    }
    // 태그가 바뀌면 새 엘리먼트에도 값을 다시 대입한다.
    if ((changedProperties.has("properties") || changedProperties.has("tag")) && this.element && this.properties) {
      this.updateProperties(this.element, this.properties);
    }
  }

  render() {
    if (this.loading === true) {
      return html`
        <div class="sk-container">
          <div class="sk-card">
            <u-skeleton effect="shimmer" width="100%" height="5em"   shape="rectangle"></u-skeleton>
            <u-skeleton effect="shimmer" width="80%"  height="0.8em" shape="rounded"></u-skeleton>
            <u-skeleton effect="shimmer" width="40%"  height="0.75em" shape="rounded"></u-skeleton>
          </div>
          <div class="sk-doc">
            <u-skeleton effect="shimmer" lines="5" height="0.8em" shape="rounded"></u-skeleton>
          </div>
        </div>`;
    }

    if (this.element != null) {
      return this.element;
    }
    return nothing;
  }

  /**
   * `UDataElement.load()`의 JSON 파싱 실패 시 호출됩니다. 스트리밍 중(`loading`)에는
   * JSON이 아직 완성되지 않아 일시적으로 파싱에 실패하는 것이 정상이므로 콘솔 기록도 건너뜁니다.
   */
  protected override async error(error: unknown): Promise<void> {
    if (this.loading) return;
    this.reportError(error);
  }

  /**
   * `tag`가 변경될 때마다 블록 엘리먼트를 새로 생성합니다.
   * 블록으로 등록되지 않은 태그나 아직 정의되지 않은 커스텀 엘리먼트는 만들지 않고 기록만 합니다.
   * JSON 자체는 이미 파싱에 성공한 상태이므로(스트리밍 중 파싱 실패와는 다른 케이스),
   * `loading` 여부와 무관하게 항상 기록합니다.
   */
  private updateElement(tag?: string) {
    tag = tag?.trim();

    // 태그 이름이 없는 경우, 에러 처리합니다.
    if (!tag) {
      this.element = null;
      this.reportError(new Error("Tag is required"));
      return;
    }

    // 블록으로 등록된 태그만 허용 — «정의된 커스텀 엘리먼트» 는 기준이 아니다.
    // 페이지에는 신뢰된 HTML 을 받는 엘리먼트도 정의돼 있다.
    if (!getElementBlockProperties(tag)) {
      this.element = null;
      this.reportError(new Error(
        `"${tag}" is not a registered element block — register its schema with registerElementBlock() or ElementPromptBuilder.add()`
      ));
      return;
    }

    // 등록은 됐지만 아직 정의되지 않은 커스텀 엘리먼트(모듈 미로드)
    if (!customElements.get(tag)) {
      this.element = null;
      this.reportError(new Error(`Unknown tag: ${tag}`));
      return;
    }

    this.element = document.createElement(tag);
  }

  /**
   * 블록 스키마에 적힌 이름만 대입합니다. 스키마 밖의 이름은 대입하지 않고 기록합니다 —
   * 블록 하나를 통째로 버리지 않는 것은 LLM 이 무해한 여분 키를 붙이는 일이 흔하기 때문입니다.
   */
  private updateProperties(element: HTMLElement, props: unknown) {
    if (typeof props !== "object" || props === null || Array.isArray(props)) {
      this.reportError(new Error(`Properties must be an object: ${JSON.stringify(props)}`));
      return;
    }

    const allowed = getElementBlockProperties(element.localName) ?? new Set<string>();
    const accepted: Record<string, unknown> = {};
    const rejected: string[] = [];
    for (const [key, value] of Object.entries(props)) {
      if (allowed.has(key)) accepted[key] = value;
      else rejected.push(key);
    }

    if (rejected.length > 0) {
      this.reportError(new Error(`Not in the "${element.localName}" schema, not assigned: ${rejected.join(", ")}`));
    }

    try {
      Object.assign(element, accepted);
    } catch (error) {
      this.reportError(error);
    }
  }

  /**
   * 에러 카드 없이 콘솔에만 기록합니다. 채팅 UI에 갑작스러운 에러 카드가 뜨는 것을 피하기 위함입니다 —
   * addon 모듈을 import하지 않아 아직 등록되지 않은 태그일 수도 있으므로, 실제 에러라기보다
   * "아직 준비 안 됨"에 가깝습니다.
   */
  private reportError(error: unknown): void {
    console.error(`[u-element-block]`, error);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "u-element-block": UElementBlock;
  }
}
