/**
 * HTML 출력 시 XSS 방지를 위한 escape 유틸
 *
 * 컨텍스트에 맞는 함수를 사용해야 합니다.
 *
 * - escapeHtmlText : HTML 텍스트 노드에 삽입할 때
 * - escapeHtmlAttr : HTML attribute 값에 삽입할 때
 * - escapeHtmlHref : href/src 같은 URL attribute에 삽입할 때
 */


/**
 * Zero Width Space / LTR / RTL mark / BOM 등
 * 화면에 표시되지 않는 유니코드 문자를 제거합니다.
 */
/**
 * \uD45C\uC2DC \uACBD\uB85C\uC5D0\uC11C \uC81C\uAC70\uD560 zero-width \uBB38\uC790.
 *
 * ZWJ(U+200D)\uB294 **\uC758\uB3C4\uC801\uC73C\uB85C \uC81C\uC678**\uD55C\uB2E4. ZWJ \uB294 \uC774\uBAA8\uC9C0 \uC2DC\uD000\uC2A4\uB97C \uACB0\uD569\uD558\uB294
 * \uC870\uD310 \uBB38\uC790\uB77C, \uC81C\uAC70\uD558\uBA74 \uC0AC\uC6A9\uC790\uAC00 \uC785\uB825\uD55C \uAC00\uC871\u00B7\uC9C1\uC5C5 \uC774\uBAA8\uC9C0\uAC00 \uB0B1\uAC1C\uB85C \uBD84\uD574\uB41C\uB2E4
 * (\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67 \u2192 \uD83D\uDC68\uD83D\uDC69\uD83D\uDC67). \uD45C\uC2DC \uACBD\uB85C\uC5D0\uC11C\uB294 \uCF58\uD150\uCE20 \uBCF4\uC874\uC774 \uC6B0\uC120\uC774\uB2E4.
 */
const ZERO_WIDTH_DISPLAY_REGEX = /[\u200B\u200C\u200E\u200F\uFEFF]/gu;

/**
 * URL \uC704\uC0DD \uACBD\uB85C\uC5D0\uC11C \uC81C\uAC70\uD560 zero-width \uBB38\uC790.
 *
 * URL \uC548\uC5D0\uC11C\uB294 zero-width \uBB38\uC790\uC5D0 \uC815\uB2F9\uD55C \uC870\uD310 \uC758\uBBF8\uAC00 \uC5C6\uACE0 protocol \uC6B0\uD68C
 * \uB09C\uB3C5\uD654\uC5D0 \uC4F0\uC77C \uC218 \uC788\uC73C\uBBC0\uB85C ZWJ \uAE4C\uC9C0 \uC804\uBD80 \uC81C\uAC70\uD55C\uB2E4 \u2014 \uACB0\uD569 \uC2DC\uD000\uC2A4 \uD574\uCCB4\uAC00
 * \uC5EC\uAE30\uC11C\uB294 \uC758\uB3C4\uB41C \uB3D9\uC791\uC774\uBBC0\uB85C \uADDC\uCE59\uC744 \uBA85\uC2DC\uC801\uC73C\uB85C \uD574\uC81C\uD55C\uB2E4.
 */
// eslint-disable-next-line no-misleading-character-class
const ZERO_WIDTH_STRICT_REGEX = /[\u200B\u200C\u200D\u200E\u200F\uFEFF]/gu;

export function stripZeroWidth(value: string): string {
  return ZERO_WIDTH_DISPLAY_REGEX.test(value)
    ? value.replace(ZERO_WIDTH_DISPLAY_REGEX, '')
    : value;
}


/** HTML text context escape 대상 문자 */
const HTML_TEXT_ESCAPE_REGEX = /[&<>"']/g;

/** HTML text context escape용 문자 매핑 */
const HTML_TEXT_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/**
 * HTML 텍스트 노드(context)에 삽입할 문자열을 escape합니다.
 *
 * 예:
 *   <script> → &lt;script&gt;
 */
export function escapeHtmlText(value: string): string {
  return HTML_TEXT_ESCAPE_REGEX.test(value)
    ? value.replace(HTML_TEXT_ESCAPE_REGEX, (ch) => HTML_TEXT_ESCAPE_MAP[ch])
    : value;
}


/** HTML attribute escape 대상 문자 */
const HTML_ATTR_ESCAPE_REGEX = /[&<>"]/g;

/** HTML attribute escape용 문자 매핑 */
const HTML_ATTR_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
};

/**
 * HTML attribute 값(context)에 삽입할 문자열을 escape합니다.
 * 
 * 예:
 *   <div title="{value}">
 */
export function escapeHtmlAttr(value: string): string {
  return HTML_ATTR_ESCAPE_REGEX.test(value)
    ? value.replace(HTML_ATTR_ESCAPE_REGEX, (ch) => HTML_ATTR_ESCAPE_MAP[ch])
    : value;
}


/**
 * protocol 우회 공격 방지를 위한 공백/제어문자 제거.
 * 제어문자 매칭이 이 상수의 목적 자체이므로 no-control-regex 를 의도적으로 해제한다.
 */
// eslint-disable-next-line no-control-regex
const HREF_STRIP_CHARS_REGEX = /[\u0000-\u001F\u007F\s]+/g;

/** href/src에서 차단해야 하는 위험 protocol */
const HREF_UNSAFE_PROTOCOL_REGEX = /^(?:javascript|data|vbscript):/i;

/**
 * href / src attribute용 문자열 처리
 *
 * 예:
 *  <a href="{value}">
 */
export function escapeHtmlHref(value: string): string {
  // 1) zero-width 제거 + trim
  let normalized = value.replace(ZERO_WIDTH_STRICT_REGEX, '').trim();

  // 2) 공백/개행/제어문자 제거 (java\nscript: 같은 protocol 우회 방지)
  if (HREF_STRIP_CHARS_REGEX.test(normalized)) {
    normalized = normalized.replace(HREF_STRIP_CHARS_REGEX, '');
  }

  // 3) backslash URL 정규화 (http:\\evil.com → http://evil.com)
  normalized = normalized.replace(/\\/g, '/');

  // 4) protocol-relative URL 차단 (//evil.com)
  if (normalized.startsWith('//')) {
    return '#';
  }

  // 5) 위험 protocol 차단 (javascript:, data:, vbscript:)
  if (HREF_UNSAFE_PROTOCOL_REGEX.test(normalized)) {
    return '#';
  }

  // 6) attribute에 안전하게 넣을 수 있도록 escape
  return escapeHtmlAttr(normalized);
}