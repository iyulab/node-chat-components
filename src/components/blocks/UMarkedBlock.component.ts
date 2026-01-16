import { LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { Marked } from "marked";
import markedKatex from "marked-katex-extension";

import { BaseElement } from "@iyulab/components/dist/components/BaseElement.js";
import { UTooltip } from "@iyulab/components/dist/components/tooltip/UTooltip.component.js";
import { UCodeBlock } from "./UCodeBlock.component.js";
import { URefTag } from "../references/URefTag.component.js";
import { URefCard } from "../references/URefCard.component.js";
import { URefCardGroup } from "../references/URefCardGroup.component.js";
import type { ReferenceSource, TextBlockReference } from "../../types/BlockReference";
import { styles } from "./UMarkedBlock.styles.js";

/**
 * 마크다운 컨텐츠를 렌더링하는 컴포넌트입니다.
 *
 * 주의:
 * - refs로 삽입되는 커스텀 태그(u-ref-*)는 속성/내용을 모두 escape하여 XSS를 방지합니다.
 * - 코드블록 내부는 HTML을 전부 텍스트로 취급(escape)하며, refs 태그는 통째 제거합니다.
 * - 인덱스 기반 삽입(ref.endIndex)이 깨지지 않도록 "normalize(제로폭 제거)"를 insert 전에 1회 수행합니다.
 */
export class UMarkedBlock extends BaseElement {
  static styles = [super.styles, styles];
  static dependencies: Record<string, typeof BaseElement> = {
    "u-tooltip": UTooltip,
    "u-code-block": UCodeBlock,
    "u-ref-tag": URefTag,
    "u-ref-card": URefCard,
    "u-ref-card-group": URefCardGroup,
  };

  private parser = new Marked({
    pedantic: false,
    gfm: true,
    breaks: true,
    silent: true,
    renderer: {
      code: ({ text, lang }) => {
        lang ||= "plaintext";
        const safeLang = this.escapeHTML(lang);

        // 코드블록은 "보여주기"가 목적이므로: refs 태그 제거 + HTML escape
        const safeText = this.sanitizeText(text);

        return `<u-code-block lang="${safeLang}">${safeText}</u-code-block>`;
      },
    },
  }).use(markedKatex({ output: "mathml" }));

  /** 마크다운 컨텐츠를 렌더링할 때 사용할 값입니다. */
  @property({ type: String }) value?: string;
  /** 컨텐츠의 인용 출처들입니다. */
  @property({ type: Array }) refs?: TextBlockReference[];

  render() {
    if (!this.value) return nothing;

    // 1) 제로폭 제거 -> refs 인덱스 기준 통일
    let value = this.normalizeText(this.value);

    // 2) refs 삽입 (삽입되는 HTML은 내부에서 escape)
    if (this.refs && this.refs.length > 0) {
      value = this.insert(value, this.refs);
    }

    // 3) 마크다운 파싱
    const html = this.parser.parse(value, { async: false });
    return unsafeHTML(html);
  }

  /**
   * 인용/출처 참조객체가 있을때 문자열에 출처태그를 삽입합니다.
   * @param value 삽입할 마크다운 문자열
   * @return 삽입된 마크다운 문자열
   */
  private insert(value: string, refs: TextBlockReference[]) {
    // endIndex 기준 역순 삽입 (앞 인덱스가 변하지 않게)
    const reversed = [...refs].sort((a, b) => b.endIndex - a.endIndex);

    reversed.forEach((ref) => {
      const sources = ref.sources ?? [];
      const firstSource = sources.at(0);

      // 텍스트/속성 안전 처리
      const tagName = this.escapeHTML(ref.name ?? "");
      const tagLink = this.escapeHTML(firstSource?.url ?? "#");

      let tooltip = "";

      // 참고 자료 1개
      if (firstSource && sources.length === 1) {
        tooltip = this.buildCard(firstSource, true);
      }

      // 참고 자료 2개 이상
      if (sources.length > 1) {
        const cards = sources.map((s) => this.buildCard(s, false)).join("");
        tooltip = `<u-ref-card-group slot="tooltip">${cards}</u-ref-card-group>`;
      }

      const tag =
        `<u-ref-tag href="${tagLink}" title="${tagName}">` +
        `${tagName}${tooltip}</u-ref-tag>`;

      // endIndex에 삽입
      value = value.slice(0, ref.endIndex) + tag + value.slice(ref.endIndex);
    });

    return value;
  }

  /**
   * 참조 카드 엘리먼트를 안전하게 빌드합니다.
   */
  private buildCard(source: ReferenceSource, slot: boolean) {
    const type = this.escapeHTML(source.type ?? "");
    const href = this.escapeHTML(source.url ?? "#");
    const heading = this.escapeHTML(source.title ?? "");
    const tags = this.escapeHTML((source.tags ?? []).join(","));
    const snippet = this.escapeHTML(source.snippet ?? "");

    const slotAttr = slot ? ` slot="tooltip"` : "";
    return `<u-ref-card${slotAttr} type="${type}" href="${href}" heading="${heading}" tags="${tags}">${snippet}</u-ref-card>`;
  }

  /**
   * Zero Width Space, LTR/RTL marks, BOM 등 특수 제어 문자를 제거합니다.
   * (ref.endIndex 기준을 흔들지 않게 insert 전에 1회 수행)
   */
  private normalizeText(value: string): string {
    return value.replace(/\u200B|\u200C|\u200D|\u200E|\u200F|\uFEFF/g, "");
  }

  /**
   * 코드블록 내부 텍스트를 안전하게 처리합니다.
   * - u-ref-tag는 통째로 제거(코드블록 안에서 UI 태그가 살아남는 것 방지)
   * - 나머지는 전부 HTML escape
   */
  private sanitizeText(value: string): string {
    // u-ref-tag 전체 블록 제거(내부 카드/그룹 포함)
    value = value.replace(/<u-ref-tag\b[^>]*>[\s\S]*?<\/u-ref-tag>/gi, "");

    // 그 외 HTML은 모두 텍스트로
    return this.escapeHTML(value);
  }

  /**
   * HTML 텍스트 노드로 안전하게 삽입하기 위해 escape 합니다.
   */
  private escapeHTML(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
}
