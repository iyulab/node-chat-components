import { describe, it, expect, beforeEach } from 'vitest';
import '../../src/components/blocks/UMarkedBlock.js';
import type { UMarkedBlock } from '../../src/components/blocks/UMarkedBlock.js';
import type { ReferenceCitation } from '../../src/types/References.js';

/**
 * 인라인 인용 배지의 **왕복**(insert -> parse -> restore)을 고정한다.
 *
 * 🔴**0.11.7 이 이 왕복을 깨뜨렸고 0.11.8 까지 게시된 채였다.** 그 릴리스가 더한 XSS
 * 하드닝(`html` 렌더러가 raw HTML을 escape)이 **컴포넌트 자신의 내부 플레이스홀더**까지
 * escape 했다 — 플레이스홀더가 HTML 주석이라 marked 가 `html` 토큰으로 분류했기 때문이다.
 * `restore()` 는 escape 된 형태를 알아보지 못하고, 배지 자리에 플레이스홀더가 **글자
 * 그대로** 화면에 남았다.
 *
 * ⚠**그때 이미 XSS 회귀 테스트는 있었고 초록이었다** — 그 테스트는 「raw HTML이 escape
 * 되는가」만 재고 「우리 플레이스홀더가 왕복하는가」는 재지 않았다. ***두 축은 같은 렌더러를***
 * ***지나지만 서로를 증명하지 않는다.*** 이 파일이 그 두 번째 축이다.
 */
describe('UMarkedBlock 인용 배지 왕복', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  async function render(value: string, refs?: ReferenceCitation[]): Promise<UMarkedBlock> {
    const el = document.createElement('u-marked-block') as UMarkedBlock;
    el.value = value;
    if (refs) el.refs = refs;
    document.body.appendChild(el);
    await el.updateComplete;
    // willUpdate의 80ms 지연 큐잉이 flush되어야 최종 렌더 결과를 볼 수 있다.
    await new Promise((r) => setTimeout(r, 120));
    await el.updateComplete;
    return el;
  }

  const refAt = (endIndex: number, label = '[1]'): ReferenceCitation => ({
    startIndex: Math.max(0, endIndex - 1),
    endIndex,
    label,
    sources: [{ type: 'web', title: '출처 문서', url: 'https://example.com/doc' }],
  });

  it('문장 중간의 인용이 u-ref-tag 로 렌더되고 플레이스홀더가 화면에 남지 않는다', async () => {
    const value = '기본값은 deny all 입니다.';
    const el = await render(value, [refAt(value.indexOf('입니다'))]);
    const root = el.shadowRoot!;

    expect(root.querySelector('u-ref-tag')).not.toBeNull();
    // 회귀의 본체 — 이 문자열이 보이면 escape 된 플레이스홀더가 살아남은 것이다.
    expect(root.textContent).not.toContain('<!--ref:');
    expect(root.textContent).not.toContain('&lt;!--ref:');
  });

  it('인용이 여러 개면 각각 별도의 u-ref-tag 가 된다', async () => {
    const value = '첫째 근거가 있고 둘째 근거도 있다.';
    const el = await render(value, [
      refAt(value.indexOf('가 있고'), '[1]'),
      refAt(value.indexOf('도 있다'), '[2]'),
    ]);
    expect(el.shadowRoot!.querySelectorAll('u-ref-tag').length).toBe(2);
    expect(el.shadowRoot!.textContent).not.toContain('ref:');
  });

  it('강조 안쪽에 삽입돼도 왕복이 깨지지 않는다', async () => {
    const value = '**중요한 결론** 이다.';
    const el = await render(value, [refAt(value.indexOf('** 이다'))]);
    const root = el.shadowRoot!;
    expect(root.querySelector('strong')).not.toBeNull();
    expect(root.querySelector('u-ref-tag')).not.toBeNull();
    expect(root.textContent).not.toContain('ref:');
  });

  it('코드블록 안에서는 배지를 만들지 않고 센티널도 남기지 않는다', async () => {
    const value = '```js\nconst a = 1;\n```';
    const el = await render(value, [refAt(value.indexOf('const a') + 5)]);
    const root = el.shadowRoot!;
    // 코드블록 경로는 removeRefs 를 지나므로 배지도 센티널도 없어야 한다.
    expect(root.textContent).not.toContain('ref:');
    // PUA 센티널이 두부(tofu)로 남지 않는다.
    expect(root.textContent).not.toMatch(/[\u{E000}-\u{F8FF}]/u);
  });

  it('테이블 셀 안에 삽입돼도 왕복이 깨지지 않는다', async () => {
    // 테이블은 `Parser.parseInline`을 지나는 **별도 경로**다 — 본문과 같은 렌더러를
    // 쓰는지 여부가 XSS 축에서 한 번 문제가 된 자리라(그때 고쳐졌다), ref 왕복도
    // 같은 자리에서 따로 깨질 수 있다. 두 경로를 각각 고정한다.
    const value = '| 항목 | 값 |\n|---|---|\n| 정책 | deny all |';
    const el = await render(value, [refAt(value.indexOf(' |', value.indexOf('deny all')))]);
    const root = el.shadowRoot!;
    expect(root.querySelector('u-table-block')).not.toBeNull();
    expect(root.textContent).not.toContain('ref:');
    expect(root.textContent).not.toMatch(/[\u{E000}-\u{F8FF}]/u);
  });

  it('refs 가 없으면 작성자가 쓴 주석 형태는 종전대로 escape 되어 보인다', async () => {
    // 하드닝은 그대로 살아 있어야 한다 — 이 수정은 escape 를 끄는 것이 아니라
    // 우리 플레이스홀더를 escape 대상 «밖»으로 옮긴 것이다.
    const el = await render('작성자가 쓴 <!--ref:0--> 입니다.');
    expect(el.shadowRoot!.textContent).toContain('<!--ref:0-->');
    expect(el.shadowRoot!.querySelector('u-ref-tag')).toBeNull();
  });
});
