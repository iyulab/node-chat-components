import { describe, it, expect, beforeEach } from 'vitest';
import '../../src/components/blocks/UMarkedBlock.js';
import type { UMarkedBlock } from '../../src/components/blocks/UMarkedBlock.js';

/**
 * **수식 렌더의 «현행 출력»을 고정하는 회귀** (cycle-481).
 *
 * ## 왜 이 파일이 «먼저» 필요한가
 *
 * `marked-katex-extension` 을 걷어내고 같은 확장을 우리가 직접 구현하기로 결정됐다
 * (2026-09-09 사람 결정 — `HANDOFF.md` `## Decided this session`). 그 교체는
 * ***«동등한 대체»임을 증명해야 하는 종류의 변경***인데, 교체 전에 현행 동작을 고정해 두지
 * 않으면 증명할 대상 자체가 없다. ⇒ 이 파일은 **교체 전에 작성돼 초록**이고, 교체 후에도
 * **그대로 초록**이어야 한다. 그것이 «동등»의 조작적 정의다.
 *
 * ## 🔴 여기 적힌 것은 «바람직한 동작»이 아니라 «관측된 동작»이다
 *
 * 전부 실제 크로미움에서 찍어 본 값이다(추측 금지 — 이 리포의 rule 7.5). 놀라웠던 것 둘을
 * 명시해 둔다. 둘 다 **직관과 다르므로, 교체본이 이것을 «고치면» 그것은 개선이 아니라
 * 계약 변경**이다:
 *
 * - **`a$x$ b` — 앞에 공백이 없어도 파싱된다.** 업스트림의 표준 규칙은 `start()` 에서
 *   *"`$` 가 문자열 처음이거나 앞이 공백"* 을 요구하지만, `start()` 는 marked 가 **인라인
 *   텍스트를 어디서 끊을지** 고르는 힌트일 뿐이라 토크나이저는 그 뒤 위치에서도 호출된다
 *   ⇒ 실질적으로 non-standard 와 같게 동작한다.
 * - **`$$x^2$$` 를 «한 줄 안»에 쓰면 `display="block"` 인 채로 `<p>` 안에 남는다.**
 *   블록 승격은 «`$$` 가 자기 줄에 혼자 있을 때»(blockRule)만 일어난다.
 *
 * ## ⚠ 재는 것과 재지 않는 것
 *
 * `output: "mathml"` 이므로 **MathML 구조와 `annotation` 원문**만 잰다. KaTeX 내부 마크업의
 * 세부(클래스 이름·요소 순서)는 **KaTeX 버전이 정하는 것**이라 여기서 고정하면 이 회귀가
 * *katex 업그레이드마다* 깨진다 — 그것은 우리 교체가 만든 회귀가 아니다. 실제로 이 파일이
 * 존재하는 이유의 절반이 **katex 0.18 추종을 여는 것**이므로, 버전에 민감한 축을 고정하면
 * 자기 목적을 배반한다.
 */
describe('UMarkedBlock — KaTeX 렌더 계약 (교체 전 고정)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  async function render(value: string): Promise<UMarkedBlock> {
    const el = document.createElement('u-marked-block') as UMarkedBlock;
    el.value = value;
    document.body.appendChild(el);
    await el.updateComplete;
    // willUpdate 의 80ms 지연 큐잉(queuedTimer)이 flush 돼야 최종 렌더를 볼 수 있다.
    await new Promise((r) => setTimeout(r, 120));
    await el.updateComplete;
    return el;
  }

  /** 렌더된 shadow root 안의 MathML 노드들. */
  function maths(el: UMarkedBlock): Element[] {
    return Array.from(el.shadowRoot!.querySelectorAll('math'));
  }

  /** `<annotation encoding="application/x-tex">` 의 원문 — 우리가 katex 에 넘긴 것. */
  function tex(m: Element): string {
    return m.querySelector('annotation')?.textContent ?? '';
  }

  describe('구분자 파싱', () => {
    it('인라인 `$…$` 를 수식으로 렌더한다 (displayMode 아님)', async () => {
      const el = await render('a $x^2$ b');
      const m = maths(el);
      expect(m).toHaveLength(1);
      expect(tex(m[0])).toBe('x^2');
      expect(m[0].getAttribute('display')).toBeNull();
      // 주변 텍스트가 보존된다.
      expect(el.shadowRoot!.textContent).toContain('a ');
      expect(el.shadowRoot!.textContent).toContain(' b');
    });

    it('한 줄 안의 `$$…$$` 는 displayMode 지만 «블록으로 승격되지는 않는다»', async () => {
      const el = await render('a $$x^2$$ b');
      const m = maths(el);
      expect(m).toHaveLength(1);
      expect(tex(m[0])).toBe('x^2');
      expect(m[0].getAttribute('display')).toBe('block');
      // 📌관측된 사실 — 여전히 문단 «안»이다. blockRule 은 `$$` 가 자기 줄일 때만 걸린다.
      expect(m[0].closest('p')).not.toBeNull();
    });

    it('`$$` 가 자기 줄에 있으면 블록으로 승격된다 (문단 밖)', async () => {
      const el = await render(['$$', String.raw`\frac{1}{2}`, '$$'].join('\n'));
      const m = maths(el);
      expect(m).toHaveLength(1);
      expect(tex(m[0])).toBe(String.raw`\frac{1}{2}`);
      expect(m[0].getAttribute('display')).toBe('block');
      // 📌블록 승격의 관측 가능한 차이는 «문단 밖에 있다»는 것이다.
      expect(m[0].closest('p')).toBeNull();
    });

    it('📌앞에 공백이 없어도 파싱된다 — `start()` 는 힌트일 뿐이다', async () => {
      const el = await render('a$x$ b');
      const m = maths(el);
      expect(m, '이것이 깨지면 교체본이 표준 규칙을 «더 엄격하게» 적용한 것이다').toHaveLength(1);
      expect(tex(m[0])).toBe('x');
    });

    it('닫는 `$` 뒤의 구두점을 허용한다', async () => {
      const el = await render('value is $x$, ok');
      expect(maths(el)).toHaveLength(1);
      expect(el.shadowRoot!.textContent).toContain(', ok');
    });

    it('목록 항목 안에서도 파싱된다', async () => {
      const el = await render(['- item', '- $x$'].join('\n'));
      const m = maths(el);
      expect(m).toHaveLength(1);
      expect(m[0].closest('li')).not.toBeNull();
    });
  });

  describe('🔴 수식이 «아닌» 것을 수식으로 만들지 않는다 (침묵 조건)', () => {
    it('통화 표기 하나는 수식이 아니다', async () => {
      const el = await render('costs $5 today');
      expect(maths(el)).toHaveLength(0);
      expect(el.shadowRoot!.textContent).toContain('costs $5 today');
    });

    it('🔴통화 표기 «둘»도 수식이 아니다 — 이것이 가장 흔한 오탐 경로다', async () => {
      const el = await render('from $5 to $10 today');
      expect(maths(el), '`$5 to $` 를 수식으로 읽으면 본문이 통째로 사라진다').toHaveLength(0);
      expect(el.shadowRoot!.textContent).toContain('from $5 to $10 today');
    });

    it('구분자 사이가 비어 있으면 수식이 아니다', async () => {
      const el = await render('a $$ b');
      expect(maths(el)).toHaveLength(0);
    });

    it('인라인 수식은 줄을 넘지 못한다', async () => {
      const el = await render(['a $x', 'y$ b'].join('\n'));
      expect(maths(el), '개행을 허용하면 문서 전체가 한 수식으로 삼켜질 수 있다').toHaveLength(0);
      // `breaks: true` 라 개행은 <br> 로 남는다.
      expect(el.shadowRoot!.querySelector('br')).not.toBeNull();
    });
  });

  describe('출력 형식', () => {
    it('MathML 만 낸다 — HTML 폴백 트리를 함께 내지 않는다', async () => {
      const el = await render('a $x^2$ b');
      const root = el.shadowRoot!;
      expect(root.querySelector('math'), 'output: "mathml" 계약').not.toBeNull();
      // ⚠`output: "html"` 이면 `.katex-html` 이 함께 나온다 — 두 배 크기 + 접근성 중복.
      expect(root.querySelector('.katex-html')).toBeNull();
    });

    it('🔴스타일시트가 의존하는 `.katex math` 결합점이 성립한다', async () => {
      // ⚠`UMarkedBlock.styles.ts` 가 `.katex math` 로 조판을 잡는다 — 즉 이 구조는
      //   «내부 구현»이 아니라 **우리가 의존하는 계약**이다. KaTeX 를 올릴 때 가장 먼저
      //   깨질 수 있는 자리이므로 여기서 직접 고정한다(루트 클래스는 접두 대상이 아니다).
      const el = await render('a $x^2$ b');
      const coupling = el.shadowRoot!.querySelector('.katex math');
      expect(coupling, '`.katex` 래퍼 안에 `math` 가 있어야 스타일이 걸린다').not.toBeNull();
    });

    it('🔴수식 안의 원시 HTML 을 요소로 만들지 않는다 (렌더러가 escape 를 우회하므로)', async () => {
      // ⚠이 경로는 컴포넌트의 `html` 렌더러 방어를 «지나간다» — 확장의 렌더러가 문자열을
      //   직접 돌려주고 그것이 `unsafeHTML()` 로 들어간다. 방어는 KaTeX 자신에게 있다.
      const el = await render('a $' + String.raw`\text{<img src=x onerror=alert(1)>}` + '$ b');
      const root = el.shadowRoot!;
      expect(root.querySelector('img')).toBeNull();
      expect(root.querySelector('script')).toBeNull();
      expect(maths(el)).toHaveLength(1);
    });
  });
});
