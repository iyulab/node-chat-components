import { describe, it, expect, afterEach } from 'vitest';
import '../../src/components/blocks/UCodeBlock.js';
import '../../src/components/blocks/UMarkedBlock.js';

/**
 * **섀도 루트 안에서 문서 루트의 테마를 읽는 경로**의 회귀 검사.
 *
 * 종전 경로는 `:host-context([theme="dark"])` 였고 그 선택자는 **Firefox·Safari 에서
 * 미지원**이다 — 두 브라우저에서 다크 구문 강조·다크 마크다운이 적용된 적이 없다.
 * 대체 경로는 `light-dark()` + 상속되는 `color-scheme` 이다.
 *
 * ⚠**이 테스트는 크로미움에서만 돈다.** 크로미움은 `:host-context` 도 지원하므로
 * 원래 결함을 재현하지는 못한다 — 여기서 확인하는 것은 *"새 경로가 실제 엔진에서
 * 해석되는가"* 이고, *"낡은 경로를 다시 쓰지 않는가"* 는 소스 규약 검사
 * (`tests/shadow-theme-mechanism.test.ts`)가 본다. 둘은 다른 것을 잡는다.
 *
 * ★**커스텀 프로퍼티를 직접 읽으면 안 된다.** `getComputedStyle().getPropertyValue()`
 * 는 해석된 색이 아니라 `light-dark(...)` **문자열 그대로**를 돌려준다. 그래서 그 값을
 * 실제로 소비하는 선언(`color`)의 계산값을 잰다.
 */
describe('섀도 안에서의 테마 해석', () => {
  afterEach(() => {
    document.body.replaceChildren();
    document.documentElement.style.colorScheme = '';
  });

  /**
   * 섀도 루트 안에 프로브를 심고 그 계산색을 돌려준다.
   * `probeSel` 은 그 시트에서 **문제의 커스텀 프로퍼티를 실제로 소비하는 선택자**여야 한다.
   */
  const probe = async (hostTag: string, probeTag: string, className = '') => {
    const el = document.createElement(hostTag);
    document.body.append(el);
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    const p = document.createElement(probeTag);
    if (className) p.className = className;
    el.shadowRoot!.append(p);
    const c = getComputedStyle(p).color;
    expect(c, `프로브가 색을 못 받았다 — 선택자(${probeTag}.${className})가 시트와 안 맞는다`)
      .not.toBe('');
    return c;
  };

  it('★코드블록 구문색이 color-scheme 을 따라 뒤집힌다', async () => {
    document.documentElement.style.colorScheme = 'light';
    const light = await probe('u-code-block', 'span', 'hljs-keyword');
    document.body.replaceChildren();

    document.documentElement.style.colorScheme = 'dark';
    const dark = await probe('u-code-block', 'span', 'hljs-keyword');

    // GitHub 팔레트의 keyword 색 — 라이트 #d73a49 / 다크 #ff7b72
    expect(light, '라이트 keyword 색').toBe('rgb(215, 58, 73)');
    expect(dark, '다크 keyword 색').toBe('rgb(255, 123, 114)');
  });

  it('★마크다운 본문색이 color-scheme 을 따라 뒤집힌다', async () => {
    document.documentElement.style.colorScheme = 'light';
    const light = await probe('u-marked-block', 'mark');
    document.body.replaceChildren();

    document.documentElement.style.colorScheme = 'dark';
    const dark = await probe('u-marked-block', 'mark');

    // `mark` 규칙이 --fgColor-default 를 color 로 쓴다.
    expect(light, '라이트 본문색').toBe('rgb(31, 35, 40)');
    expect(dark, '다크 본문색').toBe('rgb(240, 246, 252)');
  });

  it('color-scheme 이 없으면 라이트로 떨어진다 (시트 미로드 소비자)', async () => {
    // 토큰 시트를 로드하지 않은 소비자에게는 `color-scheme` 선언이 없다. 그 상태의
    // 정답은 **라이트**다 — 시트 부재 = 테마 미적용(정본 시트가 light 인 것과 같은 결정).
    document.documentElement.style.colorScheme = '';
    expect(await probe('u-code-block', 'span', 'hljs-keyword')).toBe('rgb(215, 58, 73)');
  });
});
