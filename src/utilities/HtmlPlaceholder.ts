/**
 * Marked 파싱 중 HTML이 GFM에 의해 오염되는 것을 방지하기 위해
 * HTML을 센티널로 치환하고, 나중에 원래 HTML로 복원하는 유틸입니다.
 */

/**
 * 센티널 경계 문자 — Unicode **Private Use Area**(U+E000..U+F8FF).
 *
 * ⚠**이 선택이 이 유틸의 계약 전부다.** 센티널은 marked 의 토크나이저를 **통과**해야 하고
 * (그래야 `restore()` 가 출력에서 되찾는다), 동시에 marked 가 **HTML로 분류하지 않아야**
 * 한다 — 분류되는 순간 `html` 토큰이 되어 소비자의 sanitizing 렌더러 손에 들어가고,
 * 거기서 형태가 바뀌면 `restore()` 는 자기가 넣은 것을 더 이상 알아보지 못한다.
 *
 * 🔴**종전 판은 HTML 주석(`<!--ref:N-->`)이었고 바로 그 이유로 깨졌다.** marked 는 주석을
 * `html` 토큰으로 잡고(실측: `text, html, text`), `UMarkedBlock` 의 XSS 하드닝 렌더러가
 * 그것을 escape 하면 `&lt;!--ref:N--&gt;` 가 되어 복원 패턴에 걸리지 않는다 — 플레이스홀더가
 * 화면에 **글자 그대로** 남는다. 「주석은 건드려지지 않는다」는 전제가 하드닝과 함께 깨진
 * 것이고, ***전제를 고치는 대신 하드닝에 예외를 두면 다음 하드닝에서 같은 자리가 다시 깨진다.***
 *
 * PUA 문자는 마크다운 문법에서 아무 의미가 없어 **평문 텍스트로만** 토큰화되고(실측),
 * `escapeHtmlText` 의 대상 문자(`& < > " '`)도 아니라 **escape 가 no-op** 이다. 코드블록·
 * 테이블 셀·강조 안에서도 원형이 보존되는 것을 확인했다. ⇒ ***어떤 sanitizing 렌더러가***
 * ***나중에 추가돼도 이 왕복은 깨지지 않는다.***
 *
 * ⚠**소스에는 escape 표기로 적는다** — 원시 PUA 문자를 파일에 두면 에디터·터미널·diff 에서
 * 두부(tofu)나 빈칸으로 보여 「거기 무엇이 있는지」를 읽을 수 없다.
 */
const SENTINEL_OPEN = '\u{E000}';
const SENTINEL_CLOSE = '\u{E001}';

/**
 * 센티널 매칭 패턴.
 *
 * `lastIndex` 상태를 공유하지 않도록 **매번 새로 만든다** — `g` 플래그가 붙은 정규식을
 * 모듈 상수로 두고 `test()`/`replace()` 에 섞어 쓰면 호출 순서에 따라 조용히 빗나간다.
 *
 * ⚠**정규식 «리터럴»로 적고 문자열로 조립하지 않는다.** 템플릿 리터럴로 `new RegExp(...)`
 * 을 만들면 백슬래시가 리터럴 단계에서 한 번 소비돼 숫자가 아니라 **글자 d 를 찾는** 정규식이
 * 조용히 만들어진다(이 파일을 쓰다 실제로 한 번 만들었다). 경계 문자를 위 상수와
 * 같은 값으로 두 번 적는 대가를 치르되, 두 자리가 **같은 파일 안**에 있고 회귀 테스트가 둘의 일치를 고정한다.
 */
const sentinelPattern = () => /\u{E000}\d+\u{E001}/gu;

/**
 * 문자열에서 ref 플레이스홀더 센티널을 제거합니다.
 *
 * 코드블록처럼 **복원 대상이 아닌** 경로에서 쓴다 — 거기서는 ref 태그를 렌더하지 않고
 * 원문을 그대로 보여야 하므로, 남은 센티널은 지운다(안 지우면 PUA 문자가 두부로 보인다).
 * 형태를 아는 곳이 이 파일 하나뿐이도록 함수로 내보낸다 — 패턴을 호출부에 복제하면
 * 종전처럼 한쪽만 바뀌어 어긋난다.
 */
export function stripRefPlaceholders(value: string): string {
  return value.replace(sentinelPattern(), '');
}

export class HtmlPlaceholder {
  private map: Record<string, string> = {};
  private idx = 0;

  reset() {
    this.map = {};
    this.idx = 0;
  }

  store(html: string): string {
    const key = `${SENTINEL_OPEN}${this.idx++}${SENTINEL_CLOSE}`;
    this.map[key] = html;
    return key;
  }

  /**
   * 파싱 결과에서 센티널을 원래 HTML로 되돌립니다.
   *
   * ⚠**아무것도 보관하지 않았으면 손대지 않는다**(`idx === 0`). 그 경우 문자열에 센티널이
   * 있다면 그것은 **작성자가 직접 쓴 글자**이지 우리가 넣은 것이 아니므로, 지우는 것이
   * 오히려 콘텐츠 손실이다. 보관분이 있을 때 매칭되지 않는 키는 빈 문자열로 지운다 —
   * 우리 것이 아닌 센티널이 화면에 두부로 남는 것을 막는다.
   */
  restore(html: string): string {
    if (this.idx === 0) return html;
    return html.replace(sentinelPattern(), (key) => this.map[key] ?? "");
  }
}
