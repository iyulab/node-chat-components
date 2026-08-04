import { html, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "@iyulab/components/dist/components/skeleton/USkeleton.js";
import { UDataElement } from "../UDataElement.js";

import { styles } from "./UElementBlock.styles.js";

const DEFAULT_BLACKLIST = ["innerHTML", "outerHTML", "textContent", "innerText", "outerText", "srcdoc"];

/**
 * `block-json` 코드펜스에서 지정한 커스텀 엘리먼트를 동적으로 렌더링하는 컴포넌트입니다.
 * 대상 태그가 등록되어 있지 않거나 데이터가 유효하지 않은 경우, 에러 카드 없이 콘솔에만 기록하고 아무것도 렌더링하지 않습니다.
 */
@customElement('u-element-block')
export class UElementBlock extends UDataElement {
  static styles = [super.styles, styles];

  /** 로딩 상태입니다. `true`인 경우, 위젯이 로딩 중임을 나타냅니다. */
  @property({ type: Boolean, reflect: true }) loading = false;
  /** `tag` 프로퍼티에 등록된 커스텀 엘리먼트를 렌더링하는 컴포넌트입니다. */
  @property({ type: String }) tag?: string;
  /** `properties` 객체의 키가 렌더링된 엘리먼트의 프로퍼티 이름과 일치하면 자동으로 할당됩니다. */
  @property({ type: Object }) properties?: Record<string, unknown>;
  /** `properties` 객체에서 위험한 프로퍼티 이름을 지정하여 차단할 수 있습니다. */
  @property({ type: Array }) blacklist: string[] = DEFAULT_BLACKLIST;

  /** 실제 렌더링된 엘리먼트입니다. `tag` 프로퍼티가 변경될 때마다 업데이트됩니다. */
  @state() private element: HTMLElement | null = null;

  protected willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("tag")) {
      this.updateElement(this.tag);
    }
    if (changedProperties.has("properties") && this.element) {
      this.updateProperties(this.element, this.properties);
    }
    if (changedProperties.has("blacklist") && this.element && this.properties) {
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
   * `tag` 프로퍼티에 등록된 커스텀 엘리먼트를 렌더링하는 컴포넌트입니다.
   * `tag`가 변경될 때마다 등록된 커스텀 엘리먼트를 새로 생성하여 렌더링합니다.
   * `tag`가 유효하지 않거나 등록된 커스텀 엘리먼트가 아닌 경우, 에러 처리합니다.
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

    // 등록된 커스텀 엘리먼트만 허용
    if (!customElements.get(tag)) {
      this.element = null;
      this.reportError(new Error(`Unknown tag: ${tag}`));
      return;
    }

    this.element = document.createElement(tag);
  }

  /**
   * `properties` 객체의 키가 렌더링된 엘리먼트의 프로퍼티 이름과 일치하면 자동으로 할당됩니다.
   * `properties` 객체에 위험한 프로퍼티가 포함되어 있는지 검증하여, 유효한 경우에만 할당합니다.
   * 할당 중 오류가 발생한 경우, 에러 처리합니다.
   */
  private updateProperties(element: HTMLElement, props: unknown) {
    if (this.validateProperties(props)) {
      try {
        // element내부에서 업데이트가 발생합니다.
        Object.assign(element, props);
      } catch (error) {
        // 프로퍼티 할당 중 오류가 발생한 경우, 에러 처리합니다.
        this.reportError(error);
      }
    } else {
      // `properties` 객체가 유효하지 않은 경우, 에러 처리합니다.
      this.reportError(new Error(`Not allowed properties: ${JSON.stringify(props)}`));
    }
  }

  /**
   * `properties` 객체에 위험한 프로퍼티가 포함되어 있는지 검증합니다.
   * DOM 조작이나 이벤트 핸들러로 악용될 수 있는 프로퍼티를 최소한으로 차단합니다.
   */
  private validateProperties(props: unknown): boolean {
    if (typeof props !== "object" || props === null || Array.isArray(props)){
      return false;
    }

    const obj = props as Record<string, unknown>;
    for (const key of Object.keys(obj)) {
      if (this.blacklist.includes(key)) return false; // 위험한 프로퍼티 차단
      // if (key.startsWith("on")) return false; // onclick 등 차단
    }
    return true;
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
