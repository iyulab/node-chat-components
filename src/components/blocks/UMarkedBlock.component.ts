import { nothing, PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { Marked, Parser, type Tokens } from "marked";
import markedKatex from "marked-katex-extension";

import { UElement } from "@iyulab/components/dist/components/UElement.js";
import { escapeHtmlText, stripZeroWidth } from "@iyulab/components/dist/utilities/sanitizers.js";
import { buildElementHTML } from "@iyulab/components/dist/utilities/elements.js";
import { UCodeBlock } from "./UCodeBlock.component.js";
import { UTableBlock } from "./UTableBlock.component.js";
import { URefTag } from "../references/URefTag.component.js";
import { URefCard } from "../references/URefCard.component.js";
import { URefCardGroup } from "../references/URefCardGroup.component.js";
import { UView } from "../views/UView.component.js";
import type { ReferenceCitation } from "../../types/References.js";
import { styles } from "./UMarkedBlock.styles.js";

/**
 * 마크다운 컨텐츠를 렌더링하는 컴포넌트입니다.
 *
 * 주의:
 * - refs로 삽입되는 커스텀 태그(u-ref-*)는 속성/내용을 모두 escape하여 XSS를 방지합니다.
 * - 코드블록 내부는 HTML을 전부 텍스트로 취급(escape)하며, refs 태그는 통째 제거합니다.
 * - 인덱스 기반 삽입(ref.endIndex)이 깨지지 않도록 "normalize(제로폭 제거)"를 insertRefs 전에 1회 수행합니다.
 */
export class UMarkedBlock extends UElement {
  static styles = [super.styles, styles];
  static dependencies: Record<string, typeof UElement> = {
    "u-code-block": UCodeBlock,
    "u-table-block": UTableBlock,
    "u-ref-tag": URefTag,
    "u-ref-card": URefCard,
    "u-ref-card-group": URefCardGroup,
    "u-view": UView,
  };

  /** 마크다운 컨텐츠를 렌더링할 때 사용할 값입니다. */
  @property({ type: String }) value?: string;
  /** 컨텐츠의 인용 출처들입니다. */
  @property({ type: Array }) refs?: ReferenceCitation[];
  
  // Marked 인스턴스: 커스텀 렌더러와 KaTeX 확장 포함
  private parser = new Marked({
    pedantic: false,
    gfm: true,
    breaks: true,
    silent: true,
    renderer: {
      code: (token) => this.renderCode(token),
      table: (token) => this.renderTable(token),
    },
  }).use(markedKatex({ output: "mathml" }));

  // Marked 파싱 중 HTML을 임시 보관하는 플레이스홀더
  private placeholder = new HtmlPlaceholder();
  // 렌더링 지연 플래그
  private queued: boolean = false;
  private timer?: number;

  disconnectedCallback(): void {
    clearTimeout(this.timer);
    super.disconnectedCallback();
  }

  protected override shouldUpdate(_changedProperties: PropertyValues): boolean {
    // 대기 중이면 렌더링 건너뛰기
    if (this.queued) return false; 
    return true;
  }

  protected override willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("value")) {
      if (this.queued) return;
      this.queued = true;

      this.timer = window.setTimeout(() => {
        this.queued = false;
        this.requestUpdate();
      }, 80);
    }
  }

  render() {
    let value = this.value;
    if (!value) return nothing;

    this.placeholder.reset();
    value = stripZeroWidth(value);

    // 참조객체가 있을 때만 refs 태그를 삽입하여 파싱 안정성 확보
    if (this.refs?.length) {
      value = this.insertRefs(value, this.refs);
    }

    let html = this.parser.parse(value, { async: false }) as string;
    return unsafeHTML(this.placeholder.restore(html));
  }

  /** 
   * 코드블록은 별도의 컴포넌트로 렌더링 합니다.
   */
  private renderCode(token: Tokens.Code): string {
    const lang = token.lang ?? "plaintext";
    const trimmed = token.raw.trimEnd();
    const isClosed = trimmed.endsWith("```") || trimmed.endsWith("~~~");

    // View 코드블록 감지
    if (lang === 'view-json') {
      return UView.buildHTML(token.text, { loading: !isClosed });
    }

    // Intent 코드블록 감지
    if (lang === 'intent-json') {
      return ''; // 출력 X
    }

    // 코드블록은 refs 태그 제거 + HTML escape
    const safeText = this.removeRefs(token.text);

    return buildElementHTML("u-code-block", { lang: lang, loading: !isClosed }, safeText);
  }

  /**
   * 테이블은 JSON 데이터로 변환하여 별도의 컴포넌트로 렌더링합니다.
   * 셀 내부의 인라인 마크다운(볼드, 코드, br 등)도 HTML로 변환합니다.
   */
  private renderTable(token: Tokens.Table): string {
    const headers = token.header.map((h: Tokens.TableCell) => ({
      text: h.tokens ? Parser.parseInline(h.tokens) : h.text,
      align: h.align
    }));
    const rows = token.rows.map((row: Tokens.TableCell[]) =>
      row.map((cell) => ({
        text: cell.tokens ? Parser.parseInline(cell.tokens) : cell.text,
        align: cell.align
      }))
    );
    return UTableBlock.buildHTML({ headers, rows });
  }

  /**
   * 인용/출처 참조객체가 있을때 ref 태그 HTML을 this.placeholder에 보관하고
   * 마크다운 문자열의 해당 위치에 주석 플레이스홀더를 삽입합니다.
   */
  private insertRefs(value: string, refs: ReferenceCitation[]): string {
    // 참조객체를 endIndex 기준 내림차순으로 정렬하여 뒤에서부터 삽입
    const sorted = [...refs].sort((a, b) => b.endIndex - a.endIndex);

    for (const ref of sorted) {
      const sources = ref.sources ?? [];
      const label = escapeHtmlText(ref.label ?? `[${refs.indexOf(ref) + 1}]`);
      const link = sources.at(0)?.url;

      let tooltip = "";
      if (sources.length > 0) {
        const cards = sources.map((s) => URefCard.buildHTML(s)).join("");
        tooltip = buildElementHTML("u-ref-card-group", { slot: "tooltip" }, cards);
      }

      const html = buildElementHTML("u-ref-tag", { href: link }, label + tooltip);
      const key = this.placeholder.store(html);
      value = value.slice(0, ref.endIndex) + key + value.slice(ref.endIndex);
    }

    return value;
  }

  /**
   * 코드블록 내부의 <!--ref:idx--> 플레이스홀더와 그 외 refs 태그를 모두 제거하여 HTML이 코드로 렌더링되도록 합니다.   
   */
  private removeRefs(value: string): string {
    // u-ref-tag 전체 블록 제거(내부 카드/그룹 포함)
    value = value.replace(/<u-ref-tag\b[^>]*>[\s\S]*?<\/u-ref-tag>/gi, "");
    // <!--ref:idx--> 플레이스홀더 제거
    value = value.replace(/<!--ref:\d+-->/g, "");
    // 그 외 HTML은 모두 텍스트로
    return value;
  }
}

/**
 * Marked 파싱 중 HTML이 GFM에 의해 오염되는 것을 방지하기 위해
 * HTML을 주석 플레이스홀더로 치환하고, 나중에 원래 HTML로 복원하는 유틸입니다.
 */
class HtmlPlaceholder {
  private map: Record<string, string> = {};
  private idx = 0;

  reset() {
    this.map = {};
    this.idx = 0;
  }

  /** html을 저장하고 대응하는 플레이스홀더 키를 반환합니다. */
  store(html: string): string {
    const key = `<!--ref:${this.idx++}-->`;
    this.map[key] = html;
    return key;
  }

  /** html 안의 등록된 모든 플레이스홀더를 원래 HTML로 복원합니다. */
  restore(html: string): string {
    if (this.idx === 0) return html;
    return html.replace(/<!--ref:\d+-->/g, (key) => this.map[key] ?? "");
  }
}