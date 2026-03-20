import { html, nothing, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";

import { UElement } from "@iyulab/components/dist/components/UElement.js";
import { UDataElement } from "@iyulab/components/dist/components/UDataElement.js";
import { USkeleton } from "@iyulab/components/dist/components/skeleton/USkeleton.component.js";
import { styles } from "./UView.styles.js";

const DEFAULT_BLACKLIST = ["innerHTML", "outerHTML", "textContent", "innerText", "outerText", "srcdoc"];

/**
 * 뷰 컴포넌트를 렌더링 또는 오류를 표시하는 컴포넌트입니다.
 */
export class UView extends UDataElement {
  static styles = [super.styles, styles];
  static dependencies: Record<string, typeof UElement> = {
    "u-skeleton": USkeleton,
  };

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
            <u-skeleton effect="shimmer" width="40%"  height="0.75em" shape="rounded"></u-skeleton>
            <u-skeleton effect="shimmer" width="80%"  height="0.75em" shape="rounded"></u-skeleton>
            <u-skeleton effect="shimmer" width="60%" height="0.8em"  shape="rounded"></u-skeleton>
            <u-skeleton effect="shimmer" width="100%" height="0.8em"  shape="rounded"></u-skeleton>
            <u-skeleton effect="shimmer" width="80%"  height="0.8em"  shape="rounded"></u-skeleton>
          </div>
        </div>`;
    }

    if (this.element != null) {
      return this.element;
    }
    return nothing;
  }

  /** 
   * `loading`이 `true`인 경우, 에러 UI로 대체하지 않습니다. 
   */
  protected override async error(error: Error): Promise<void> {
    if (this.loading) return; // 로딩 중에는 에러 UI로 대체하지 않음

    await super.error(error);
  }

  /**
   * `tag` 프로퍼티에 등록된 커스텀 엘리먼트를 렌더링하는 컴포넌트입니다.
   * `tag`가 변경될 때마다 등록된 커스텀 엘리먼트를 새로 생성하여 렌더링합니다.
   * `tag`가 유효하지 않거나 등록된 커스텀 엘리먼트가 아닌 경우, 에러 처리합니다.
   */
  private updateElement(tag?: string) {
    tag = tag?.trim();

    // 태그 이름이 없는 경우, 에러 처리합니다.
    if (!tag) {
      this.element = null;
      void super.error(new Error("Tag is required"));
      return;
    }

    // 등록된 커스텀 엘리먼트만 허용
    if (!customElements.get(tag)) {
      this.element = null;
      void super.error(new Error(`Unknown tag: ${tag}`));
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
        void super.error(error);
      }
    } else {
      // `properties` 객체가 유효하지 않은 경우, 에러 처리합니다.
      void super.error(new Error(`Not allowed properties: ${JSON.stringify(props)}`));
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
}