import { escapeHtmlAttr, escapeHtmlHref } from './sanitizers.js';

const URL_ATTR = new Set(['href', 'src']);

/**
 * 커스텀 엘리먼트 HTML 문자열을 생성하는 유틸리티입니다.
 */
export class HtmlBuilder {
  /**
   * 지정한 태그, 속성, 내용으로 커스텀 엘리먼트 HTML 문자열을 생성합니다.
   *
   * 속성 값 처리 규칙:
   * - `null` / `undefined` → 해당 속성 생략
   * - `false` (boolean)   → 해당 속성 생략
   * - `true`  (boolean)   → 값 없이 키만 출력 (예: `disabled`)
   * - `object`            → `JSON.stringify` 후 `escapeHtmlAttr`
   * - `href` / `src` 키  → `escapeHtmlHref` 적용
   * - 그 외 string       → `escapeHtmlAttr` 적용
   *
   * `content`는 이미 안전한 HTML 문자열이라고 가정합니다 (내부 escape 없음).
   *
   * @param tag     - 커스텀 엘리먼트 태그 이름 (예: `"u-ref-tag"`)
   * @param attrs   - 속성 객체
   * @param content - 내부 HTML 문자열 (기본값: `""`)
   * @returns 생성된 HTML 문자열
   *
   * @example
   * HtmlBuilder.build('u-ref-tag', { href: 'https://example.com', disabled: true }, 'Click');
   * // → '<u-ref-tag href="https://example.com" disabled>Click</u-ref-tag>'
   */
  public static build(
    tag: string,
    attrs: Record<string, string | boolean | object | null | undefined> = {},
    content = ''
  ): string {
    const attrStr = Object.entries(attrs)
      .flatMap(([k, v]) => {
        if (v === undefined || v == null || v === false) return [];
        if (v === true) return [k];
        const raw = typeof v === 'object' ? JSON.stringify(v) : String(v);
        const escaped = URL_ATTR.has(k) ? escapeHtmlHref(raw) : escapeHtmlAttr(raw);
        return [`${k}="${escaped}"`];
      })
      .join(' ');

    return attrStr
      ? `<${tag} ${attrStr}>${content}</${tag}>`
      : `<${tag}>${content}</${tag}>`;
  }
}
